import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IsEmail, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CmsService } from './cms.service';

class EntityQueryDto {
  @IsIn([
    'leadership',
    'projects',
    'events',
    'galleryAlbums',
    'galleryImages',
    'blogCategories',
    'blogPosts',
    'socialLinks',
    'polls',
    'notices',
  ])
  entity:
    | 'leadership'
    | 'projects'
    | 'events'
    | 'galleryAlbums'
    | 'galleryImages'
    | 'blogCategories'
    | 'blogPosts'
    | 'socialLinks'
    | 'polls'
    | 'notices';
}

class ContactFormDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  subject?: string;
}

class PollVoteDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  optionIndex: number;
}

class PollUndoVoteDto {
  @IsString()
  @MaxLength(120)
  visitorToken: string;
}

class PollResultsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  visitorToken?: string;
}

@Controller()
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('public/content')
  getPublicContent() {
    return this.cmsService.getPublicContent();
  }

  @Post('public/contact-message')
  async submitContactForm(@Body() dto: ContactFormDto) {
    await this.cmsService.createContactLead(dto);
    return {
      success: true,
      message: 'Message received successfully. Our team will reach out shortly.',
    };
  }

  @Get('public/polls/:id/results')
  getPollResults(@Param('id', ParseIntPipe) id: number, @Query() query: PollResultsQueryDto) {
    return this.cmsService.getPollResults(id, query.visitorToken);
  }

  @Post('public/polls/:id/vote')
  votePoll(@Param('id', ParseIntPipe) id: number, @Body() dto: PollVoteDto) {
    return this.cmsService.voteOnPoll(id, dto.visitorToken, dto.optionIndex);
  }

  @Post('public/polls/:id/unvote')
  unvotePoll(@Param('id', ParseIntPipe) id: number, @Body() dto: PollUndoVoteDto) {
    return this.cmsService.undoPollVote(id, dto.visitorToken);
  }

  @Get('admin/leads')
  @UseGuards(JwtAuthGuard)
  getLeads() {
    return this.cmsService.listContactLeads();
  }

  @Delete('admin/leads/:id')
  @UseGuards(JwtAuthGuard)
  deleteLead(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.removeContactLead(id);
  }

  @Post('admin/analytics/ping')
  @UseGuards(JwtAuthGuard)
  pingAnalytics(@Body() payload: Record<string, unknown>) {
    return { success: true, payload };
  }

  @Post('admin/seed')
  @UseGuards(JwtAuthGuard)
  seedData() {
    return this.cmsService.getPublicContent();
  }

  @Get('admin/overview')
  @UseGuards(JwtAuthGuard)
  getOverview() {
    return this.cmsService.getAdminOverview();
  }

  @Get('admin/site-settings')
  @UseGuards(JwtAuthGuard)
  getSiteSettings() {
    return this.cmsService.getSiteSettings();
  }

  @Patch('admin/site-settings')
  @UseGuards(JwtAuthGuard)
  updateSiteSettings(@Body() payload: Record<string, unknown>) {
    return this.cmsService.updateSiteSettings(payload);
  }

  @Get('admin/homepage')
  @UseGuards(JwtAuthGuard)
  getHomepage() {
    return this.cmsService.getHomepage();
  }

  @Patch('admin/homepage')
  @UseGuards(JwtAuthGuard)
  updateHomepage(@Body() payload: Record<string, unknown>) {
    return this.cmsService.updateHomepage(payload);
  }

  @Get('admin/about')
  @UseGuards(JwtAuthGuard)
  getAbout() {
    return this.cmsService.getAbout();
  }

  @Patch('admin/about')
  @UseGuards(JwtAuthGuard)
  updateAbout(@Body() payload: Record<string, unknown>) {
    return this.cmsService.updateAbout(payload);
  }

  @Get('admin/membership')
  @UseGuards(JwtAuthGuard)
  getMembership() {
    return this.cmsService.getMembership();
  }

  @Patch('admin/membership')
  @UseGuards(JwtAuthGuard)
  updateMembership(@Body() payload: Record<string, unknown>) {
    return this.cmsService.updateMembership(payload);
  }

  @Get('admin/contact-info')
  @UseGuards(JwtAuthGuard)
  getContactInfo() {
    return this.cmsService.getContactInfo();
  }

  @Patch('admin/contact-info')
  @UseGuards(JwtAuthGuard)
  updateContactInfo(@Body() payload: Record<string, unknown>) {
    return this.cmsService.updateContactInfo(payload);
  }

  @Get('admin/content')
  @UseGuards(JwtAuthGuard)
  listByEntity(@Query() query: EntityQueryDto) {
    return this.cmsService.list(query.entity);
  }

  @Get('admin/polls/votes')
  @UseGuards(JwtAuthGuard)
  getPollVotesOverview() {
    return this.cmsService.getPollVotesOverview();
  }

  @Get('admin/polls/votes/:id')
  @UseGuards(JwtAuthGuard)
  getPollVoteDetails(@Param('id', ParseIntPipe) id: number) {
    return this.cmsService.getPollVoteDetails(id);
  }

  @Post('admin/content')
  @UseGuards(JwtAuthGuard)
  createByEntity(@Query() query: EntityQueryDto, @Body() payload: Record<string, unknown>) {
    return this.cmsService.create(query.entity, payload);
  }

  @Patch('admin/content/:id')
  @UseGuards(JwtAuthGuard)
  updateByEntity(
    @Query() query: EntityQueryDto,
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.cmsService.update(query.entity, id, payload);
  }

  @Delete('admin/content/:id')
  @UseGuards(JwtAuthGuard)
  removeByEntity(@Query() query: EntityQueryDto, @Param('id', ParseIntPipe) id: number) {
    return this.cmsService.remove(query.entity, id);
  }
}
