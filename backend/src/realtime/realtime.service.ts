import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'project',
  brokers: ['kafka:9092']
});

@Injectable()
export class RealtimeService implements OnModuleInit {
  
  async onModuleInit() {
    console.log('RealtimeService initialized');
  }
  
  async update(id: number, client) {
    try {
      const groupId = `group-${id}`;
      const consumer = kafka.consumer({ groupId: `${groupId}-${Math.round(Math.random() * 1000)}` });
      
      await consumer.connect();
      await consumer.subscribe({ topic: `group-${id}`, fromBeginning: false });
      
      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          if (message && message.value) {
            const value = message.value.toString();;
            
            let parsedMessage;
            try {
              parsedMessage = JSON.parse(value);
            } catch (e) {
              parsedMessage = value;
            }

            console.log(parsedMessage)
            
            client.emit(`group-${id}`, parsedMessage);
          }
        },
      });
      
      return `Subscribed to group-${id}`;
    } catch (error) {
      console.error(`Error setting up consumer for group ${id}:`, error);
      return `Error: ${error.message}`;
    }
  }
}