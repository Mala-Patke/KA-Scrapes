(async () => {
    let res = await require('./index')(process.argv.slice(2).join(" "));
    console.log(res);
})();