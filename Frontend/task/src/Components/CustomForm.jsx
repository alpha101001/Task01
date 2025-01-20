import {useEffect, useLayoutEffect, useState} from "react";
import {Form, Select, Button, Row, Col} from "antd";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead,
    TableRow
} from "@mui/material";
import {groupBy} from "lodash";
import '../Styles/antStyle.css';

export const CustomForm = () => {
    const [form] = Form.useForm();
    const [disableInsertRow, setDisableInsertRow] = useState(false);
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [distMapDiv, setDistMapDiv] = useState({});
    const [topDistrictData, setTopDistrictData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1) Fetch Divisions
                const divRes = await fetch("http://localhost:3000/divisions");
                const divisionsData = await divRes.json();
                // console.log("Divisions =>", divisionsData);
                setDivisions(divisionsData);

                // 2) Fetch Districts (after Divisions fetch completes)
                await fetch("http://localhost:3000/districts").then((res) => res.json()).then((data) => {
                    setDistricts(data);
                    const groupedByDivision = groupBy(data, "division");
                    setDistMapDiv(groupedByDivision);
                });
                // const districtsData = await distRes.json();
                // // console.log("Districts =>", districtsData);
                // setDistricts(districtsData);

                // 3) Create distMapDiv using the freshly fetched district data
                // const groupedByDivision = groupBy(districts, "division");
                // console.log(groupedByDivision,'groupedByDivision');


            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    // Top District
    const getTopDistrictOptions = (val) => {
        console.log(val,'value');
        const topDivision = form.getFieldValue("division");
        if (!topDivision) return [];
        const possible = distMapDiv[val] || [];
        const distData = possible.map((d) => ({label: d.name, value: d.name}));
        setTopDistrictData(distData);
        console.log(distData,'distData');
        return distData;
    };

    //existing division and district pairs
    const getUsedDivisionDistricts = () => {
        const rows = form.getFieldValue("districtWithDivisions") || [];
        return rows
            .filter((r) => r.division && r.district)
            .map((r) => ({division: r.division, district: r.district}));
    };

    //
    const getTableDivisionOptions = (rowIndex) => {
        const rows = form.getFieldValue("districtWithDivisions") || [];
        const currentRow = rows[rowIndex] || {};
        const currentDivision = currentRow.division || "";

        // All used pairs in the table
        const usedPairs = getUsedDivisionDistricts();

        return divisions.reduce((acc, divObj) => {
            const divName = divObj.name;

            // All possible districts for a specific division
            const possible = distMapDiv[divName] || [];

            // Districts used by other rows that share this division
            const usedDistricts = usedPairs
                .filter((p) => p.division === divName)
                .map((p) => p.district);


            // excludes usedDistricts
            const remain = possible.filter((distObj) => !usedDistricts.includes(distObj.name));
            if (!(remain.length === 0 && divName !== currentDivision)) {

                acc.push({label: divName, value: divName});
            }
            return acc;
        }, []);
    };


    //No duplicates for the same division
    const getTableDistrictOptions = (rowIndex) => {
        const rows = form.getFieldValue("districtWithDivisions") || [];
        const currentRow = rows[rowIndex] || {};
        const currentDivision = currentRow.division || "";
        const currentDistrict = currentRow.district || "";

        if (!currentDivision) return [];

        // All possible districts for that division
        const possible = distMapDiv[currentDivision] || [];


        const used = getUsedDivisionDistricts().filter(
            (p) => p.division === currentDivision
        );
        const usedDistNames = used.map((p) => p.district);

        return possible
            .filter((distObj) => {
                const distName = distObj.name;
                if (usedDistNames.includes(distName)) {
                    return distName === currentDistrict;
                }
                return true;
            })
            .map((d) => ({label: d.name, value: d.name}));
    };
    const checkIfInsertRowShouldDisable = () => {
        // getTopDistrictOptions();
        const tableRows = form.getFieldValue("districtWithDivisions") || [];
        // No rows => enable
        if (tableRows.length === 0) {
            setDisableInsertRow(false);
            return;
        }
        // If ANY row is missing division or district => disable
        const hasEmpty = tableRows.some(
            (row) => !row.division || !row.district
        );
        setDisableInsertRow(hasEmpty);
    };

    const handleTopDivisionChange = (val) => {
        console.log(val, 'val');
        form.setFieldsValue({district: ""});
        getTopDistrictOptions(val);

    }
    // user changes division in a row => reset the district
    const handleDivisionChange = (val, rowIndex) => {
        const rows = form.getFieldValue("districtWithDivisions") || [];
        rows[rowIndex].division = val;
        rows[rowIndex].district = ""; // force them to pick again
        form.setFieldsValue({districtWithDivisions: rows});
        checkIfInsertRowShouldDisable();

    };
    const onFinish = async (values) => {
        console.log("Submitted =>", values);
        const payload = {
            topDivision: values.division,
            topDistrict: values.district,
            rows: values.districtWithDivisions
        };

        try {
            const response = await fetch("http://localhost:3000/submitSelections", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // handle HTTP errors
                const errorMsg = await response.text();
                throw new Error(`Server error: ${errorMsg}`);
            }

            const data = await response.json();
            console.log("POST Success:", data);
        } catch (err) {
            console.error("POST Error:", err);
        }

    };

    return (
        <Form
            form={form}
            onValuesChange={checkIfInsertRowShouldDisable}
            onFinish={onFinish}
            initialValues={{
                division: "",
                district: "",
                districtWithDivisions: []
            }}
            style={{height: "100%", width: "100%"}}
        >
            <Row gutter={[16, 16]} style={{backgroundColor: "#1c1b15",paddingTop: "2rem" }}>

                <Col xs={24} sm={24} md={12} xl={12}>
                    <Form.Item
                        label="Initial Division"
                        className="custom-form-item"
                        name="division"
                        rules={[
                            {required: true, message: "Select a division"}
                        ]}
                    >
                        <Select
                            className="custom-select"
                            style={{width: "100%"}}
                            options={divisions.map((d) => ({
                                label: d.name,
                                value: d.name
                            }))}
                            onChange={(val) => handleTopDivisionChange(val)}
                            dropdownStyle={{
                                backgroundColor: "#25c2b0",
                                color: "yellow",
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                    <Form.Item
                        className="custom-form-item"
                        label="Initial District"
                        name="district"
                        rules={[
                            {required: true, message: "Select a district"}
                        ]}
                    >
                        <Select
                            className="custom-select"
                            style={{width: "100%"}}
                            options={topDistrictData}
                            dropdownStyle={{
                                backgroundColor: "#25c2b0",
                                color: "yellow",
                            }}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <TableContainer
                        sx={{
                            position: "relative",
                            display: "flex",
                            width: "100%",
                            // "& td, & th": { whiteSpace: "nowrap" }
                        }}
                    >
                        <Table
                            aria-labelledby="solutionTaskTable"
                            sx={{
                                "& .MuiTableCell-root:first-of-type": {pl: 0},
                                "& .MuiTableCell-root:last-of-type": {pr: 0}
                            }}
                        >
                            <TableHead>
                                <TableRow sx={{backgroundColor: "#1c1b15"}}>
                                    <TableCell align="center" sx={{
                                        color: "#25e70f",
                                        fontWeight: "bold",
                                        fontSize: "1.4rem"
                                    }}>Division</TableCell>
                                    <TableCell align="center" sx={{
                                        color: "#25e70f",
                                        fontWeight: "bold",
                                        fontSize: "1.4rem"
                                    }}
                                    >
                                        District
                                    </TableCell>
                                    <TableCell
                                        align="center"
                                        sx={{
                                            color: "#25e70f",
                                            fontWeight: "bold",
                                            fontSize: "1.4rem"
                                        }}
                                    >
                                        Action
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Form.List name="districtWithDivisions">
                                    {(fields, {add, remove}) => (
                                        <>
                                            {console.log(fields,'fields')}
                                            {fields.map((field, index) => (

                                                <TableRow key={field.key} sx={{backgroundColor: "#1c1b15",height:"12vh"}}>

                                                    <TableCell align="center" sx={{width: "10rem"}}>
                                                        <Form.Item
                                                            style={{margin: 0}}
                                                            name={[field.name, "division"]}
                                                            rules={[
                                                                {required: true, message: "Select a division"}
                                                            ]}
                                                        >
                                                            <Select
                                                                className="custom-select"
                                                                style={{width: "100%", fontWeight: "bold"}}
                                                                // Hides exhausted divisions, unless this row is already using it
                                                                options={getTableDivisionOptions(index)}
                                                                onChange={(val) => handleDivisionChange(val, index)}
                                                                dropdownStyle={{
                                                                    backgroundColor: "#25c2b0",
                                                                    color: "yellow",
                                                                }}

                                                            />
                                                        </Form.Item>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{width: "10rem"}}>
                                                        <Form.Item
                                                            style={{margin: 0}}
                                                            name={[field.name, "district"]}
                                                            rules={[
                                                                {required: true, message: "Select a district"}
                                                            ]}
                                                        >
                                                            <Select
                                                                style={{width: "100%"}}
                                                                className="custom-select"
                                                                options={getTableDistrictOptions(index)}
                                                                dropdownStyle={{
                                                                    backgroundColor: "#25c2b0",
                                                                    color: "yellow",
                                                                }}
                                                            />
                                                        </Form.Item>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{width: "1rem"}}>
                                                        <Button
                                                            onClick={() => remove(index)}
                                                            style={{
                                                                backgroundColor: "black",
                                                                color: "yellow",
                                                                fontWeight: "bold",
                                                                // padding: "1.2rem",
                                                                // margin: "1rem"
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    <Button
                                                        type="primary"
                                                        style={{
                                                            backgroundColor: `${disableInsertRow ? 'rgba(255,255,255,0.61)' : "black"}`,
                                                            color: `${disableInsertRow ? 'rgba(14,13,13,0.61)' : "yellow"}`,
                                                            fontWeight: "bold",
                                                            padding: "1.2rem",
                                                            margin: "1rem",

                                                        }}
                                                        onClick={() => add({division: "", district: ""})}
                                                        disabled={disableInsertRow}
                                                    >
                                                        Insert Row
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    )}
                                </Form.List>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Col>
                <Col xs={24} style={{display: "flex", justifyContent: "flex-end"}}>
                    <Form.Item style={{alignItems:"end"}}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{
                                backgroundColor: "black",
                                color: "yellow",
                                fontWeight: "bold",
                                padding: "1.5rem",
                                margin: "2rem"

                            }}
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
