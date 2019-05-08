'use strict';
const zlib = require('zlib');

const Controller = require('egg').Controller;

// eslint-disable-next-line no-unused-vars
function zlibDeflate(opt) {
  return new Promise((resolve, reject) => {
    zlib.deflate(JSON.stringify(opt), (err, buffer) => {
      if (!err) {
        const nops = buffer.toString('base64');
        console.log(nops);
        resolve(buffer);
      } else {
        // handle error
        console.log(err);
        return reject(err);
      }
    });
  });
}

class HomeController extends Controller {
  async index() {
    const { ctx } = this;

    let body = {
      name: 'zanjs',
    };
    const buf = new Buffer(JSON.stringify(body));
    // body = await zlibDeflate(body);
    body = zlib.gzipSync(buf);
    const opt = {
      dataType: 'json',
      method: 'POST',
      data: body,
      headers: {
        'Content-Encoding': 'gzip',
        'Acpet-Encoding': 'gzip',
      },
      gzip: true,
      timeout: 30000,
    };
    // let nops = '';
    // nops = await zlibDeflate(opt);
    const as = await ctx.curl('http://127.0.0.1:10088/api/v1/login2', opt);
    ctx.body = as;
  }
}

module.exports = HomeController;
