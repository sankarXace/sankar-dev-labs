import { Module } from '@nestjs/common';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@sankar-dev-labs/auth';

export const AUTH_SERVICE = 'AUTH_SERVICE';
export const WORKSPACE_SERVICE = 'WORKSPACE_SERVICE';
export const ISSUE_SERVICE = 'ISSUE_SERVICE';
export const INTEGRATION_SERVICE = 'INTEGRATION_SERVICE';

function tcpClientFactory(
  name: string,
  hostEnv: string,
  portEnv: string,
  defaultPort: number
) {
  return {
    provide: name,
    useFactory: (config: ConfigService) => {
      const host = config.get<string>(hostEnv) ?? 'localhost';
      const port = config.get<number>(portEnv) ?? defaultPort;
      return ClientProxyFactory.create({
        transport: Transport.TCP,
        options: { host, port: Number(port) },
      });
    },
    inject: [ConfigService],
  };
}

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'default-secret-min-16-chars',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    JwtStrategy,
    tcpClientFactory(AUTH_SERVICE, 'AUTH_SERVICE_HOST', 'AUTH_TCP_PORT', 3002),
    tcpClientFactory(WORKSPACE_SERVICE, 'WORKSPACE_SERVICE_HOST', 'WORKSPACE_TCP_PORT', 3010),
    tcpClientFactory(ISSUE_SERVICE, 'ISSUE_SERVICE_HOST', 'ISSUE_TCP_PORT', 3020),
    tcpClientFactory(INTEGRATION_SERVICE, 'INTEGRATION_SERVICE_HOST', 'INTEGRATION_TCP_PORT', 3040),
  ],
  exports: [AUTH_SERVICE, WORKSPACE_SERVICE, ISSUE_SERVICE, INTEGRATION_SERVICE, JwtModule],
})
export class AuthModule { }
