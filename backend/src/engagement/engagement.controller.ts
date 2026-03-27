import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EndSessionDto, StartSessionDto, TrackEventDto } from './engagement.dto';
import { EngagementService } from './engagement.service';

@Controller()
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Post('engagement/session/start')
  startSession(@Body() dto: StartSessionDto) {
    return this.engagementService.startSession(dto);
  }

  @Post('engagement/event')
  trackEvent(@Body() dto: TrackEventDto) {
    return this.engagementService.trackEvent(dto);
  }

  @Post('engagement/session/end')
  endSession(@Body() dto: EndSessionDto) {
    return this.engagementService.endSession(dto);
  }

  @Get('admin/engagement/overview')
  @UseGuards(JwtAuthGuard)
  overview() {
    return this.engagementService.adminOverview();
  }

  @Get('admin/engagement/sessions')
  @UseGuards(JwtAuthGuard)
  sessions() {
    return this.engagementService.adminSessions();
  }

  @Get('admin/engagement/sessions/:id')
  @UseGuards(JwtAuthGuard)
  sessionDetail(@Param('id', ParseIntPipe) id: number) {
    return this.engagementService.adminSessionDetail(id);
  }

  @Get('admin/engagement/pages')
  @UseGuards(JwtAuthGuard)
  pages() {
    return this.engagementService.adminPages();
  }

  @Get('admin/engagement/events')
  @UseGuards(JwtAuthGuard)
  events() {
    return this.engagementService.adminEvents();
  }

  @Get('admin/engagement/funnel')
  @UseGuards(JwtAuthGuard)
  funnel() {
    return this.engagementService.adminFunnel();
  }
}
