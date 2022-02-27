import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogsocketModule } from './logsocket/logsocket.module';
import { LogsocketGateway } from './logsocket.gateway';
import { StractureService } from './k8s/stracture/stracture.service';
import { FetcherService } from './k8s/fetcher/fetcher.service';
import { FirestoreModule } from './firestore/firestore.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BackupService } from './backup/backup.service';
import { UsageService } from './usage/usage.service';
import { OrganizationService } from './organization/organization.service';
import { AccountService } from './account/account.service';
import { UserService } from './user/user.service';
import { ClusterController } from './cluster/cluster.controller';

const envFilePath = `${process.cwd()}/config/${process.env.NODE_ENV || ""}.env`
console.log("envFilePath:" + envFilePath)


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: envFilePath,

    }),
    FirestoreModule.forRoot({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        keyFilename: '/Users/m/projects/logk8s/listener/pay4-100-firebase-adminsdk-1ch4h-5044b20abb.json'
      }),
      inject: [ConfigService],
    }),
    LogsocketModule
  ],
  controllers: [AppController, ClusterController],
  providers: [AppService, LogsocketGateway, StractureService, FetcherService, BackupService, UsageService, OrganizationService, AccountService, UserService],
})
export class AppModule {}
