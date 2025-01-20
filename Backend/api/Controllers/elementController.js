const { allDivisions, allDistricts } = require("../Config/Constant.js");


exports.getDivisions = (req, res) => {
    const response = allDivisions.map(({ id, name }) => ({
        id,
        name
    }));
    res.json(response);
};


exports.getDistricts = (req, res) => {
    const response = allDistricts.map(({ name, division }) => ({
        name,
        division
    }));
    res.json(response);
};

exports.postSelections = (req, res) => {
    const { topDivision, topDistrict, rows } = req.body;
    console.log("topDivision =>", topDivision);
    console.log("topDistrict =>", topDistrict);
    console.log("rows =>", rows);
    res.json({
        message: "Selections received successfully",
        receivedData: {
            topDivision,
            topDistrict,
            rows
        }
    });
};
