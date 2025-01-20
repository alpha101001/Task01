import React, { useEffect, useState } from "react";
import { Form, Select, Button, Row, Col } from "antd";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { groupBy } from "lodash";

export const CustomForm = () => {
    const [form] = Form.useForm();

    // We trigger a re-render on each form change
    const [refresh, setRefresh] = useState(false);
    const [disableInsertRow, setDisableInsertRow] = useState(false);

    // 1) Hardcoded Divisions & Districts
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [distMapDiv, setDistMapDiv] = useState({});


    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1) Fetch Divisions
                const divRes = await fetch("http://localhost:3000/divisions");
                const divisionsData = await divRes.json();
                console.log("Divisions =>", divisionsData);
                setDivisions(divisionsData);

                // 2) Fetch Districts (after Divisions fetch completes)
                const distRes = await fetch("http://localhost:3000/districts");
                const districtsData = await distRes.json();
                console.log("Districts =>", districtsData);
                setDistricts(districtsData);

                // 3) Create distMapDiv using the freshly fetched district data
                const groupedByDivision = groupBy(districtsData, "division");
                setDistMapDiv(groupedByDivision);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    // Top District
    const getTopDistrictOptions = () => {
        const topDivision = form.getFieldValue("division");
        if (!topDivision) return [];
        const possible = distMapDiv[topDivision] || [];
        return possible.map((d) => ({ label: d.name, value: d.name }));
    };

    //existing division and district pairs
    const getUsedDivisionDistricts = () => {
        const rows = form.getFieldValue("districtWithDivisions") || [];
        return rows
            .filter((r) => r.division && r.district)
            .map((r) => ({ division: r.division, district: r.district }));
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

                acc.push({ label: divName, value: divName });
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
            .map((d) => ({ label: d.name, value: d.name }));
    };
    const checkIfInsertRowShouldDisable = () => {
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

    // user changes division in a row => reset the district
    const handleDivisionChange = (val, rowIndex) => {
        const rows = form.getFieldValue("districtWithDivisions") || [];
        rows[rowIndex].division = val;
        rows[rowIndex].district = ""; // force them to pick again
        form.setFieldsValue({ districtWithDivisions: rows });
        checkIfInsertRowShouldDisable();

    };

    //render on change
    const onValuesChange = () => {
        setRefresh((prev) => !prev);
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
            onValuesChange={onValuesChange}
            onFinish={onFinish}
            initialValues={{
                division: "",
                district: "",
                districtWithDivisions: []
            }}
        >
            <Row gutter={[16, 16]}>

                <Col xs={24} sm={24} md={12} xl={12}>
                    <Form.Item label="Division" name="division">
                        <Select
                            style={{ width: "100%" }}
                            options={divisions.map((d) => ({
                                label: d.name,
                                value: d.name
                            }))}
                        />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} xl={12}>
                    <Form.Item label="District" name="district">
                        <Select style={{ width: "100%" }} options={getTopDistrictOptions()} />
                    </Form.Item>
                </Col>
                <Col xs={24}>
                    <TableContainer
                        sx={{
                            position: "relative",
                            display: "block",
                            width: "100%",
                            "& td, & th": { whiteSpace: "nowrap" }
                        }}
                    >
                        <Table
                            aria-labelledby="solutionTaskTable"
                            sx={{
                                "& .MuiTableCell-root:first-of-type": { pl: 2 },
                                "& .MuiTableCell-root:last-of-type": { pr: 3 }
                            }}
                        >
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "#e5e5e5" }}>
                                    <TableCell align="center">Division</TableCell>
                                    <TableCell align="center">District</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Form.List name="districtWithDivisions">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, index) => (
                                                <TableRow key={field.key}>
                                                    <TableCell align="center" sx={{ width: "10rem" }}>
                                                        <Form.Item
                                                            style={{ margin: 0 }}
                                                            name={[field.name, "division"]}
                                                            rules={[
                                                                { required: true, message: "Select a division" }
                                                            ]}
                                                        >
                                                            <Select
                                                                style={{ width: "100%" }}
                                                                // Hides exhausted divisions, unless this row is already using it
                                                                options={getTableDivisionOptions(index)}
                                                                onChange={(val) => handleDivisionChange(val, index)}
                                                            />
                                                        </Form.Item>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "10rem" }}>
                                                        <Form.Item
                                                            style={{ margin: 0 }}
                                                            name={[field.name, "district"]}
                                                            rules={[
                                                                { required: true, message: "Select a district" }
                                                            ]}
                                                        >
                                                            <Select
                                                                style={{ width: "100%" }}

                                                                options={getTableDistrictOptions(index)}
                                                            />
                                                        </Form.Item>
                                                    </TableCell>
                                                    <TableCell align="center" sx={{ width: "1rem" }}>
                                                        <Button onClick={() => remove(index)}>Delete</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            <TableRow>
                                                <TableCell colSpan={3} align="left">
                                                    <Button
                                                        type="primary"
                                                        style={{ backgroundColor: "green" }}
                                                        onClick={() => add({ division: "", district: "" })}
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

                <Col xs={24}>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};
