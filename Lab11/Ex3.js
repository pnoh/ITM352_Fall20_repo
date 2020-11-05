name = "Phil";
age = 19;
attributes  =  name + ";" + age + ";" + (age + 0.5) + ";" + (0.5 - age);
parts = attributes.split(";");
for(i in parts) {
    console.log(`${i} is a ${typeof parts[i]}`);
}
console.log(parts.join(","));