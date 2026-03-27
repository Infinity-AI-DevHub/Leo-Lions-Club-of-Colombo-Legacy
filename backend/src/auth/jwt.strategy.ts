import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'leo-lions-legacy-hardcoded-jwt-secret-2026',
    });
  }

  validate(payload: { sub: number; email: string; role: string; fullName: string }) {
    return payload;
  }
}
