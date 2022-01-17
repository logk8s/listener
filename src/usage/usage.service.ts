import {
  Inject,
  Injectable,
Logger} from '@nestjs/common';
import { CollectionReference, Timestamp } from '@google-cloud/firestore';
import { UsageDocument } from './usage.document';

@Injectable()
export class UsageService {
  private logger: Logger = new Logger(UsageService.name);

  constructor(
    @Inject(UsageDocument.collectionName)
    private usagesCollection: CollectionReference<UsageDocument>,
  ) {}

  async create({ name, dueDate }): Promise<UsageDocument> {
    const docRef = this.usagesCollection.doc(name);
    await docRef.set({
      minute: Timestamp.now(),
      bytes: 1
    });
    const usageDoc = await docRef.get();
    const usage = usageDoc.data();
    return usage;
  }

  async findAll(): Promise<UsageDocument[]> {
    const snapshot = await this.usagesCollection.get();
    const usages: UsageDocument[] = [];
    snapshot.forEach(doc => usages.push(doc.data()));
    return usages;
  }
}
