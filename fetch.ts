import https from 'https';

https.get('https://tartanbuildersinc.com/', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    const text = data.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const matches = text.match(/.{0,50}(43017|Dublin|road|street|way|blvd|lane).{0,50}/gi);
    console.log(matches?.join('\n'));
  });
});
