import {useEffect, useMemo, useState} from "react";
import {useForm, useFieldArray, Controller} from "react-hook-form";
import {DataGrid} from "@mui/x-data-grid";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Button,
    Box
} from "@mui/material";
import {groupBy} from "lodash";

const divisions = [
    {name: "Barishal"},
    {name: "Chattogram"},
    {name: "Dhaka"},
    {name: "Khulna"},
    {name: "Mymensingh"},
    {name: "Rajshahi"},
    {name: "Rangpur"},
    {name: "Sylhet"}
];
const districts = [
    // Barishal Division
    {name: "Barishal", division: "Barishal", area: "2,790 sq km", population: "2.3 million"},
    {name: "Barguna", division: "Barishal", area: "1,831 sq km", population: "0.9 million"},
    {name: "Bhola", division: "Barishal", area: "3,403 sq km", population: "1.8 million"},
    {name: "Jhalokati", division: "Barishal", area: "758 sq km", population: "0.7 million"},
    {name: "Patuakhali", division: "Barishal", area: "3,221 sq km", population: "1.5 million"},
    {name: "Pirojpur", division: "Barishal", area: "1,277 sq km", population: "1.1 million"},

    // Chattogram Division
    {name: "Bandarban", division: "Chattogram", area: "4,479 sq km", population: "0.4 million"},
    {name: "Brahmanbaria", division: "Chattogram", area: "1,927 sq km", population: "2.8 million"},
    {name: "Chandpur", division: "Chattogram", area: "1,704 sq km", population: "2.4 million"},
    {name: "Chattogram", division: "Chattogram", area: "5,282 sq km", population: "8.2 million"},
    {name: "Cox's Bazar", division: "Chattogram", area: "2,492 sq km", population: "2.3 million"},
    {name: "Feni", division: "Chattogram", area: "928 sq km", population: "1.4 million"},
    {name: "Khagrachari", division: "Chattogram", area: "2,700 sq km", population: "0.6 million"},
    {name: "Lakshmipur", division: "Chattogram", area: "1,456 sq km", population: "1.8 million"},
    {name: "Noakhali", division: "Chattogram", area: "3,601 sq km", population: "3.3 million"},
    {name: "Rangamati", division: "Chattogram", area: "6,116 sq km", population: "0.6 million"},

    // Dhaka Division
    {name: "Dhaka", division: "Dhaka", area: "1,463 sq km", population: "10.3 million"},
    {name: "Faridpur", division: "Dhaka", area: "2,072 sq km", population: "1.9 million"},
    {name: "Gazipur", division: "Dhaka", area: "1,741 sq km", population: "4.3 million"},
    {name: "Gopalganj", division: "Dhaka", area: "1,490 sq km", population: "1.2 million"},
    {name: "Kishoreganj", division: "Dhaka", area: "2,689 sq km", population: "3.2 million"},
    {name: "Madaripur", division: "Dhaka", area: "1,145 sq km", population: "1.2 million"},
    {name: "Manikganj", division: "Dhaka", area: "1,383 sq km", population: "1.4 million"},
    {name: "Munshiganj", division: "Dhaka", area: "955 sq km", population: "1.5 million"},
    {name: "Narayanganj", division: "Dhaka", area: "684 sq km", population: "3.1 million"},
    {name: "Narsingdi", division: "Dhaka", area: "1,140 sq km", population: "2.2 million"},
    {name: "Rajbari", division: "Dhaka", area: "1,118 sq km", population: "1.0 million"},
    {name: "Shariatpur", division: "Dhaka", area: "1,174 sq km", population: "1.2 million"},
    {name: "Tangail", division: "Dhaka", area: "3,414 sq km", population: "3.8 million"},

    // Khulna Division
    {name: "Bagerhat", division: "Khulna", area: "3,959 sq km", population: "1.5 million"},
    {name: "Chuadanga", division: "Khulna", area: "1,178 sq km", population: "0.9 million"},
    {name: "Jashore", division: "Khulna", area: "2,567 sq km", population: "2.8 million"},
    {name: "Jhenaidah", division: "Khulna", area: "1,964 sq km", population: "1.8 million"},
    {name: "Khulna", division: "Khulna", area: "4,389 sq km", population: "2.5 million"},
    {name: "Kushtia", division: "Khulna", area: "1,621 sq km", population: "2.0 million"},
    {name: "Magura", division: "Khulna", area: "1,048 sq km", population: "0.9 million"},
    {name: "Meherpur", division: "Khulna", area: "716 sq km", population: "0.7 million"},
    {name: "Narail", division: "Khulna", area: "990 sq km", population: "0.7 million"},
    {name: "Satkhira", division: "Khulna", area: "3,858 sq km", population: "2.0 million"},

    // Mymensingh Division
    {name: "Jamalpur", division: "Mymensingh", area: "2,115 sq km", population: "2.3 million"},
    {name: "Mymensingh", division: "Mymensingh", area: "4,363 sq km", population: "5.1 million"},
    {name: "Netrokona", division: "Mymensingh", area: "2,810 sq km", population: "2.2 million"},
    {name: "Sherpur", division: "Mymensingh", area: "1,360 sq km", population: "1.4 million"},

    // Rajshahi Division
    {name: "Bogura", division: "Rajshahi", area: "2,919 sq km", population: "3.4 million"},
    {name: "Joypurhat", division: "Rajshahi", area: "965 sq km", population: "1.0 million"},
    {name: "Naogaon", division: "Rajshahi", area: "3,435 sq km", population: "2.6 million"},
    {name: "Natore", division: "Rajshahi", area: "1,900 sq km", population: "1.8 million"},
    {name: "Chapainawabganj", division: "Rajshahi", area: "1,704 sq km", population: "1.7 million"},
    {name: "Pabna", division: "Rajshahi", area: "2,371 sq km", population: "2.6 million"},
    {name: "Rajshahi", division: "Rajshahi", area: "2,407 sq km", population: "2.6 million"},
    {name: "Sirajganj", division: "Rajshahi", area: "2,497 sq km", population: "3.2 million"},

    // Rangpur Division
    {name: "Dinajpur", division: "Rangpur", area: "3,444 sq km", population: "3.0 million"},
    {name: "Gaibandha", division: "Rangpur", area: "2,114 sq km", population: "2.4 million"},
    {name: "Kurigram", division: "Rangpur", area: "2,296 sq km", population: "2.2 million"},
    {name: "Lalmonirhat", division: "Rangpur", area: "1,247 sq km", population: "1.2 million"},
    {name: "Nilphamari", division: "Rangpur", area: "1,546 sq km", population: "1.8 million"},
    {name: "Panchagarh", division: "Rangpur", area: "1,404 sq km", population: "1.0 million"},
    {name: "Rangpur", division: "Rangpur", area: "2,308 sq km", population: "2.9 million"},
    {name: "Thakurgaon", division: "Rangpur", area: "1,809 sq km", population: "1.5 million"},

    // Sylhet Division
    {name: "Habiganj", division: "Sylhet", area: "2,636 sq km", population: "2.1 million"},
    {name: "Moulvibazar", division: "Sylhet", area: "2,799 sq km", population: "2.0 million"},
    {name: "Sunamganj", division: "Sylhet", area: "3,674 sq km", population: "2.5 million"},
    {name: "Sylhet", division: "Sylhet", area: "3,490 sq km", population: "3.6 million"}
];
export const CustomForm = () => {
    const [distMapDiv, setdistMapDiv] = useState({});
    console.log(distMapDiv);
    const {control, handleSubmit, watch} = useForm({
        defaultValues: {
            districtWithDivisions: []
        }
    });
    useEffect(() => {
        const distDiv = groupBy(districts, "division");
        setdistMapDiv(distDiv);
    }, []);

    const {fields, append, remove} = useFieldArray({
        control,
        name: "districtWithDivisions"
    });
    const allRows = watch("districtWithDivisions");

    const columns = useMemo(
        () => [
            {
                field: "division",
                headerName: "Division",
                flex: 1,

                renderCell: (params) => {
                    // figure out the row index from the ID
                    const rowIndex = params.row.index;
                    return (
                        <Controller
                            control={control}
                            name={`districtWithDivisions.${rowIndex}.division`}
                            render={({field}) => (
                                <FormControl size="small" fullWidth variant="outlined">
                                    <InputLabel>Division</InputLabel>
                                    <Select
                                        label="Division"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        variant={"filled"}
                                    >
                                        {divisions.map((div) => (
                                            <MenuItem key={div.name} value={div.name}>
                                                {div.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    );
                }
            },
            {
                field: "district",
                headerName: "District",
                flex: 1,
                renderCell: (params) => {
                    const rowIndex = params.row.index;

                    const selectedDivision =
                        allRows?.[rowIndex]?.division || "";

                    const usedDistrictsExceptCurrent = allRows
                        .filter((_, i) => i !== rowIndex)
                        .filter((r) => r.division === selectedDivision)
                        .map((r) => r.district);


                    const possibleDistricts = distMapDiv[selectedDivision] || [];


                    const currentValue = allRows?.[rowIndex]?.district || "";


                    const availableDistricts = possibleDistricts.filter((dist) => {
                        const distName = dist.name;

                        if (usedDistrictsExceptCurrent.includes(distName)) {
                            return distName === currentValue;
                        }
                        return true;
                    });

                    return (
                        <Controller
                            control={control}
                            name={`districtWithDivisions.${rowIndex}.district`}
                            render={({ field }) => (
                                <FormControl size="small" fullWidth variant="outlined">
                                    <InputLabel>District</InputLabel>
                                    <Select
                                        label="District"
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        variant={"filled"}
                                    >
                                        {availableDistricts.map((dItem) => (
                                            <MenuItem key={dItem.name} value={dItem.name}>
                                                {dItem.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    );
                }
            },

            {
                field: "actions",
                headerName: "Action",
                width: 100,
                sortable: false,
                renderCell: (params) => {
                    const rowIndex = params.row.index;
                    return (
                        <Button
                            color="error"
                            onClick={() => {
                                remove(rowIndex);
                            }}
                        >
                            Delete
                        </Button>
                    );
                }
            }
        ],
        [control, remove, watch]
    );


    const rows = fields.map((field, index) => ({
        id: field.id,
        index,
        ...field
    }));

    const onSubmit = (data) => {
        console.log("Form submission:", data);

    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>


            <div style={{width: "100%", height: 400}}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    disableSelectionOnClick

                />
            </div>
            <Box mb={2} sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <Button
                    gutterBottom
                    variant="contained"
                    onClick={() =>
                        append({
                            division: "",
                            district: ""
                        })
                    }
                >
                    Add Row
                </Button>

                <Button variant="contained" type="submit" color="primary">
                    Submit
                </Button>
            </Box>
        </form>
    );
}


