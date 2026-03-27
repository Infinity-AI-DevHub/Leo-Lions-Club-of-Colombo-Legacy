import { Controller, Get, Param, ParseIntPipe, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  MotivationAdminSessionsQueryDto,
  MotivationEndSessionDto,
  MotivationStartSessionDto,
  MotivationStatusQueryDto,
  MotivationTrackEventDto,
} from './join-motivation.dto';
import { JoinMotivationService } from './join-motivation.service';

@Controller()
export class JoinMotivationController {
  constructor(private readonly motivationService: JoinMotivationService) {}

  @Post('motivation/session/start')
  startSession(@Body() dto: MotivationStartSessionDto) {
    return this.motivationService.startSession(dto);
  }

  @Post('motivation/event')
  trackEvent(@Body() dto: MotivationTrackEventDto) {
    return this.motivationService.trackEvent(dto);
  }

  @Post('motivation/session/end')
  endSession(@Body() dto: MotivationEndSessionDto) {
    return this.motivationService.endSession(dto);
  }

  @Get('motivation/session/status')
  getStatus(@Query() query: MotivationStatusQueryDto) {
    return this.motivationService.status(query.visitorToken, query.sessionToken);
  }

  @Get('admin/motivation/overview')
  @UseGuards(JwtAuthGuard)
  adminOverview() {
    return this.motivationService.adminOverview();
  }

  @Get('admin/motivation/sessions')
  @UseGuards(JwtAuthGuard)
  adminSessions(@Query() query: MotivationAdminSessionsQueryDto) {
    return this.motivationService.adminSessions(query);
  }

  @Get('admin/motivation/sessions/:id')
  @UseGuards(JwtAuthGuard)
  adminSessionDetail(@Param('id', ParseIntPipe) id: number) {
    return this.motivationService.adminSessionDetail(id);
  }

  @Get('admin/motivation/funnel')
  @UseGuards(JwtAuthGuard)
  adminFunnel() {
    return this.motivationService.adminFunnel();
  }

  @Get('admin/motivation/pages')
  @UseGuards(JwtAuthGuard)
  adminPages() {
    return this.motivationService.adminPages();
  }

  @Get('admin/motivation/distribution')
  @UseGuards(JwtAuthGuard)
  adminDistribution() {
    return this.motivationService.adminDistribution();
  }
}
