// data received from ChatGPT
const allDivisions = [
    {
        id: 1,
        name: "Barishal",
        area: "13,225 sq km",
        population: "9.0 million",
        districts: 6,
        region: "Southern Bangladesh",
    },
    {
        id: 2,
        name: "Chattogram",
        area: "33,771 sq km",
        population: "33.0 million",
        districts: 11,
        region: "Southeastern Bangladesh",
    },
    {
        id: 3,
        name: "Dhaka",
        area: "20,593 sq km",
        population: "44.0 million",
        districts: 13,
        region: "Central Bangladesh",
    },
    {
        id: 4,
        name: "Khulna",
        area: "22,284 sq km",
        population: "15.7 million",
        districts: 10,
        region: "Southwestern Bangladesh",
    },
    {
        id: 5,
        name: "Mymensingh",
        area: "10,485 sq km",
        population: "11.4 million",
        districts: 4,
        region: "North-Central Bangladesh",
    },
    {
        id: 6,
        name: "Rajshahi",
        area: "18,153 sq km",
        population: "18.4 million",
        districts: 8,
        region: "Northwestern Bangladesh",
    },
    {
        id: 7,
        name: "Rangpur",
        area: "16,317 sq km",
        population: "17.6 million",
        districts: 8,
        region: "Northern Bangladesh",
    },
    {
        id: 8,
        name: "Sylhet",
        area: "12,635 sq km",
        population: "10.8 million",
        districts: 4,
        region: "Northeastern Bangladesh",
    },
];
// data received from ChatGPT
const allDistricts = [
    // Barishal Division
    { name: "Barishal", division: "Barishal", area: "2,790 sq km", population: "2.3 million" },
    { name: "Barguna", division: "Barishal", area: "1,831 sq km", population: "0.9 million" },
    { name: "Bhola", division: "Barishal", area: "3,403 sq km", population: "1.8 million" },
    { name: "Jhalokati", division: "Barishal", area: "758 sq km", population: "0.7 million" },
    { name: "Patuakhali", division: "Barishal", area: "3,221 sq km", population: "1.5 million" },
    { name: "Pirojpur", division: "Barishal", area: "1,277 sq km", population: "1.1 million" },

    // Chattogram Division
    { name: "Bandarban", division: "Chattogram", area: "4,479 sq km", population: "0.4 million" },
    { name: "Brahmanbaria", division: "Chattogram", area: "1,927 sq km", population: "2.8 million" },
    { name: "Chandpur", division: "Chattogram", area: "1,704 sq km", population: "2.4 million" },
    { name: "Chattogram", division: "Chattogram", area: "5,282 sq km", population: "8.2 million" },
    { name: "Cox's Bazar", division: "Chattogram", area: "2,492 sq km", population: "2.3 million" },
    { name: "Feni", division: "Chattogram", area: "928 sq km", population: "1.4 million" },
    { name: "Khagrachari", division: "Chattogram", area: "2,700 sq km", population: "0.6 million" },
    { name: "Lakshmipur", division: "Chattogram", area: "1,456 sq km", population: "1.8 million" },
    { name: "Noakhali", division: "Chattogram", area: "3,601 sq km", population: "3.3 million" },
    { name: "Rangamati", division: "Chattogram", area: "6,116 sq km", population: "0.6 million" },

    // Dhaka Division
    { name: "Dhaka", division: "Dhaka", area: "1,463 sq km", population: "10.3 million" },
    { name: "Faridpur", division: "Dhaka", area: "2,072 sq km", population: "1.9 million" },
    { name: "Gazipur", division: "Dhaka", area: "1,741 sq km", population: "4.3 million" },
    { name: "Gopalganj", division: "Dhaka", area: "1,490 sq km", population: "1.2 million" },
    { name: "Kishoreganj", division: "Dhaka", area: "2,689 sq km", population: "3.2 million" },
    { name: "Madaripur", division: "Dhaka", area: "1,145 sq km", population: "1.2 million" },
    { name: "Manikganj", division: "Dhaka", area: "1,383 sq km", population: "1.4 million" },
    { name: "Munshiganj", division: "Dhaka", area: "955 sq km", population: "1.5 million" },
    { name: "Narayanganj", division: "Dhaka", area: "684 sq km", population: "3.1 million" },
    { name: "Narsingdi", division: "Dhaka", area: "1,140 sq km", population: "2.2 million" },
    { name: "Rajbari", division: "Dhaka", area: "1,118 sq km", population: "1.0 million" },
    { name: "Shariatpur", division: "Dhaka", area: "1,174 sq km", population: "1.2 million" },
    { name: "Tangail", division: "Dhaka", area: "3,414 sq km", population: "3.8 million" },

    // Khulna Division
    { name: "Bagerhat", division: "Khulna", area: "3,959 sq km", population: "1.5 million" },
    { name: "Chuadanga", division: "Khulna", area: "1,178 sq km", population: "0.9 million" },
    { name: "Jashore", division: "Khulna", area: "2,567 sq km", population: "2.8 million" },
    { name: "Jhenaidah", division: "Khulna", area: "1,964 sq km", population: "1.8 million" },
    { name: "Khulna", division: "Khulna", area: "4,389 sq km", population: "2.5 million" },
    { name: "Kushtia", division: "Khulna", area: "1,621 sq km", population: "2.0 million" },
    { name: "Magura", division: "Khulna", area: "1,048 sq km", population: "0.9 million" },
    { name: "Meherpur", division: "Khulna", area: "716 sq km", population: "0.7 million" },
    { name: "Narail", division: "Khulna", area: "990 sq km", population: "0.7 million" },
    { name: "Satkhira", division: "Khulna", area: "3,858 sq km", population: "2.0 million" },

    // Mymensingh Division
    { name: "Jamalpur", division: "Mymensingh", area: "2,115 sq km", population: "2.3 million" },
    { name: "Mymensingh", division: "Mymensingh", area: "4,363 sq km", population: "5.1 million" },
    { name: "Netrokona", division: "Mymensingh", area: "2,810 sq km", population: "2.2 million" },
    { name: "Sherpur", division: "Mymensingh", area: "1,360 sq km", population: "1.4 million" },

    // Rajshahi Division
    { name: "Bogura", division: "Rajshahi", area: "2,919 sq km", population: "3.4 million" },
    { name: "Joypurhat", division: "Rajshahi", area: "965 sq km", population: "1.0 million" },
    { name: "Naogaon", division: "Rajshahi", area: "3,435 sq km", population: "2.6 million" },
    { name: "Natore", division: "Rajshahi", area: "1,900 sq km", population: "1.8 million" },
    { name: "Chapainawabganj", division: "Rajshahi", area: "1,704 sq km", population: "1.7 million" },
    { name: "Pabna", division: "Rajshahi", area: "2,371 sq km", population: "2.6 million" },
    { name: "Rajshahi", division: "Rajshahi", area: "2,407 sq km", population: "2.6 million" },
    { name: "Sirajganj", division: "Rajshahi", area: "2,497 sq km", population: "3.2 million" },

    // Rangpur Division
    { name: "Dinajpur", division: "Rangpur", area: "3,444 sq km", population: "3.0 million" },
    { name: "Gaibandha", division: "Rangpur", area: "2,114 sq km", population: "2.4 million" },
    { name: "Kurigram", division: "Rangpur", area: "2,296 sq km", population: "2.2 million" },
    { name: "Lalmonirhat", division: "Rangpur", area: "1,247 sq km", population: "1.2 million" },
    { name: "Nilphamari", division: "Rangpur", area: "1,546 sq km", population: "1.8 million" },
    { name: "Panchagarh", division: "Rangpur", area: "1,404 sq km", population: "1.0 million" },
    { name: "Rangpur", division: "Rangpur", area: "2,308 sq km", population: "2.9 million" },
    { name: "Thakurgaon", division: "Rangpur", area: "1,809 sq km", population: "1.5 million" },

    // Sylhet Division
    { name: "Habiganj", division: "Sylhet", area: "2,636 sq km", population: "2.1 million" },
    { name: "Moulvibazar", division: "Sylhet", area: "2,799 sq km", population: "2.0 million" },
    { name: "Sunamganj", division: "Sylhet", area: "3,674 sq km", population: "2.5 million" },
    { name: "Sylhet", division: "Sylhet", area: "3,490 sq km", population: "3.6 million" },
];
module.exports = {
    allDivisions,
    allDistricts
};