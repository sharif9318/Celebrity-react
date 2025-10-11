console.log("=======task_q============");
function hasProperty(obj, key) {
    return key in obj;
}
console.log(hasProperty({ davlat: "Uzbekistan", viloyat: "Buxoro" }, "viloyat"));
console.log(hasProperty({ davlat: "Uzbekistan", viloyat: "Buxoro" }, "tuman"));
