import { PrismaClient } from '@prisma/client';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'project',
  brokers: ['kafka:9092']
});

const producer = kafka.producer();
producer.connect();
  
const prisma = new PrismaClient();

export async function sendTasksUpdates(group_id) {

  let data = await prisma.tasks.findMany({
    where: {
      groupid: group_id
    },
    include: {
      users_assigned: {
        select: {
          name: true,
          email: true,
          pfp: true,
        }
      }
    }
  })

  producer.send({
    topic: `group-${group_id}`,
    messages: [
      {
        value: JSON.stringify({
          data: data
        })
      }
    ]
  })
}
