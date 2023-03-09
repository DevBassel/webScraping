const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");

let Data = {
  cpu: [],
  ram: [],
  ssd: [],
  hdd: [],
  gpu: [],
  cases: [],
  pus: [],
  MB: [],
  Monitors: [],
};

const urls = [
  {
    name: "Monitors",
    url: "https://www.elnekhelytechnology.com/monitors?limit=300",
    store: Data.Monitors,
  },
  {
    name: "MB",
    url: "https://www.elnekhelytechnology.com/motherboards?limit=300",
    store: Data.MB,
  },
  {
    name: "cpu",
    url: "https://www.elnekhelytechnology.com/cpu?limit=300",
    store: Data.cpu,
  },
  {
    name: "ram",
    url: "https://www.elnekhelytechnology.com/ram?limit=300",
    store: Data.ram,
  },
  {
    name: "ssd",
    url: "https://www.elnekhelytechnology.com/ssd?limit=300",
    store: Data.ssd,
  },
  {
    name: "hdd",
    url: "https://www.elnekhelytechnology.com/hdd?limit=300",
    store: Data.hdd,
  },
  {
    name: "gpu",
    url: "https://www.elnekhelytechnology.com/gpu?limit=300",
    store: Data.gpu,
  },
  {
    name: "cases",
    url: "https://www.elnekhelytechnology.com/cases?limit=300",
    store: Data.cases,
  },
  {
    name: "pus",
    url: "https://www.elnekhelytechnology.com/psu?limit=300",
    store: Data.pus,
  },
];

urls.forEach((el) => {
  scrap({
    URL: el.url,
    fileName: el.name,
    array: el.store,
  });
});

function scrap({ URL, fileName, array }) {
  request(URL, (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      $(".products-list .product-item-container").each((i, el) => {
        product({
          element: el,
          index: i,
          array: array,
          $: $,
        });
      });
      fs.writeFile(`./Data/${fileName}.json`, JSON.stringify(array), (err) => {
        if (!err) {
          console.log(fileName, " is compleat!");
        }
      });
    }
  });
}

function product({ element, index, array, $ }) {
  let name = $(element).find("h4").text();
  let img = $(element).find(".img-1").attr("data-src");
  let state = $(element).find(".left-block .label-stock").text() || "In Stock";
  let price = $(element).find(".price-new").text().match(/\d/g).join("");
  let link = $(element).find("a").attr("href");
  array.push({
    id: index + 1,
    name: name,
    img: img,
    state: state,
    price: price,
    link: link,
  });
}
