const fs = require('fs');
const net = require('net');
const port = 8125;
const client = new net.Socket();
var operation = 0;
const base = "D://NodeJS_lab_04_files//Base_files//";
const edited = "D://NodeJS_lab_04_files//Edited_files//";
const key = "25091999";

client.setEncoding('utf8');
client.connect(port, function() 
{
  console.log('Connected to server');
  client.write('remote');
});

client.on('data', function(data) 
{
  console.log(data);
  if(data == 'ACK')
  {
    connected = true;
    Operations();
  }
  else if(data == 'DEC'|| data =='bye')
  {
    client.destroy();
  }
  else if(data == 'gmnop')
  {
    Operations();
  }
  else
  {
    client.write("wrong data");
  }
  
});

client.on('close', function() {
  console.log('Connection closed');
});

function Operations()
{
  switch(operation)
  {
    case 0:
    {
      client.write("copy " + base + "file4copy.txt " + edited + "copied_file.txt")
      operation++;
      break;
    }
    case 1:
    {
      client.write("encode " + base + "file4encode.txt " + edited + "encoded_file.txt " + key);      
      operation++;
      break;
    }
    case 2:
    {
      client.write("decode " + base + "file4decode.txt " + edited + "decoded_file.txt " + key);      
      operation++;
      break;
    }
    default:
    {
      client.write("bye");
      break;
    }
  }
}