import { Mongoose } from 'mongoose';
import mineflayer from 'mineflayer';

export interface TraccClientOptions{
	ownerIds?: string[];
	prefix?: string;
	mongo?: Mongoose;
	mcBot?: mineflayer.Bot;
}
