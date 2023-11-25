import fs from 'fs';
import { parse } from 'csv-parse';

fs.createReadStream('./tasks.csv')
  .pipe(parse({ delimiter: ',', from_line: 2 }))
  .on('data', (row) => {
    const data = {
      title: row[0],
      description: row[1],
    };

    fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
  });
