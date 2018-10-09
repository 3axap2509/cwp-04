const net = require('net');
const fs = require('fs');
const port = 8125;
const crypto = require('crypto');
var counter = 0;
var user = require('os').userInfo().username;
var mainf = "d://saved_files_from_user//"
const alg = "aes-256-ctr";

const server = net.createServer((client)=>
{
  client.id = user + '_' + (counter++).toString();
  console.log(client.id +' connected');

  client.setEncoding('utf8');

  client.on('data', (data) =>
  {
    console.log(data);
    if(!client.accepted)
    {
      if(data == "remote")
      {
        client.write("ACK", err=>{if(err){console.error(err); throw err;}});
        client.accepted = true;
      }
      else
      {
        client.write("DEC", err=>{if(err){console.error(err); throw err;}});
      }
    }
    else
    {
      if(data == 'bye')
      {
        client.write('bye');
      }
      else
      {
        let buf = data.split(' ');
        if(buf.length > 3)
        {
          if(buf[0] == "encode")
          {
            let reader = fs.createReadStream(buf[1], 'utf-8');
            let writer = fs.createWriteStream(buf[2], 'utf-8');
            reader.pipe(crypto.createCipher(alg, buf[3])).pipe(writer);
            client.write('gmnop');
          }
          else if(buf[0] == 'decode')
          {
            let reader = fs.createReadStream(buf[1], 'utf-8');
            let writer = fs.createWriteStream(buf[2], 'utf-8');
            reader.pipe(crypto.createDecipher(alg, buf[3])).pipe(writer);
            client.write('gmnop');
          }
          else
          {
            console.log("get unknown operation");
            client.write('bye');
            client.destroy();
          }
        }
        else
        {
          if(buf[0] == 'copy')
          {
            let reader = fs.createReadStream(buf[1], 'utf-8');
            let writer = fs.createWriteStream(buf[2], 'utf-8');
            reader.pipe(writer);
            client.write('gmnop');
          }
          else
          {
            console.log("get unknown operation");
            client.write('bye');
            client.destroy();
          }
        }
      }
    }
  })
  client.on('close', (err)=>{if(err){console.error(err); throw err;}})
})



server.listen(port, () =>
{
  console.log(`Server listening on localhost:${port}`);
});