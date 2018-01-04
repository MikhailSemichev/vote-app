db.createCollection("students", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: [ "name" ],
            properties: {
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                gender: {
                    bsonType: "string",
                    description: "must be a string and is not required"
                }
            }
        }
    }
});

db.students.insert([
    { "_id": 1, "name": "Anne", "phone": "+1 555 123 456", "city": "London", "status": "Complete" },
    { "_id": 2, "name": "Ivan", "city": "Vancouver" }
])
