import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  AdminCommentsQueryDto,
  PublicCommentDto,
  PublicInteractionQueryDto,
  PublicReactionDto,
  PublicShareDto,
} from './interactions.dto';
import { InteractionsService } from './interactions.service';

@Controller()
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Get('public/interactions/summary')
  getPublicSummary(@Query() query: PublicInteractionQueryDto) {
    return this.interactionsService.getPublicSummary(query);
  }

  @Post('public/interactions/reaction')
  react(@Body() dto: PublicReactionDto) {
    return this.interactionsService.react(dto);
  }

  @Post('public/interactions/comment')
  comment(@Body() dto: PublicCommentDto) {
    return this.interactionsService.comment(dto);
  }

  @Post('public/interactions/share')
  share(@Body() dto: PublicShareDto) {
    return this.interactionsService.share(dto);
  }

  @Get('admin/interactions/overview')
  @UseGuards(JwtAuthGuard)
  adminOverview() {
    return this.interactionsService.adminOverview();
  }

  @Get('admin/interactions/comments')
  @UseGuards(JwtAuthGuard)
  adminComments(@Query() query: AdminCommentsQueryDto) {
    return this.interactionsService.adminComments(query);
  }

  @Delete('admin/interactions/comments/:id')
  @UseGuards(JwtAuthGuard)
  adminDeleteComment(@Param('id', ParseIntPipe) id: number) {
    return this.interactionsService.adminDeleteComment(id);
  }
}
