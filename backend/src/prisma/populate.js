const {PrismaClient, Prisma} = require('@prisma/client');
const fs = require('fs').promises;

const statusData = [
  {name: 'ACTIVE'},
  {name: 'INACTIVE'},
  {name: 'PENDING_VERIFICATION'},
  {name: 'DISABLED'},
  {name: 'BLOCKED'}
];

async function populate() {
    const status = new PrismaClient().status;
    
    await status.createMany({
      data: statusData,
      skipDuplicates: true
    });
  
  }
  
  populate()
    .then(() => {
      console.log('Registers inserted');
    })
    .catch(async (e) => {
      await fs.writeFile('polulate.log', e.message);
      throw e;
    });