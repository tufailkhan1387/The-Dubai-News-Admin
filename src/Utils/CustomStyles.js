import { createTheme } from "react-data-table-component";

const customStyles = {
    rows: {
        style: {
            minHeight: "40px",
            margin: "4px 0",
            overflow: "hidden",
        },
    },
    headCells: {
        style: {
            fontSize: "14px",
            fontWeight: "500",
            color: "white",
            background: "#4e0036",
            justifyContent: "space-between", // Align from start to end
            display: "flex",
        },
    },
    cells: {
        style: {
            fontSize: "12px",
            fontWeight: "400",
            color: "black",
            background: "#fafbfe",
            justifyContent: "space-between", // Align from start to end
            display: "flex",
        },
    },
};

// Create a theme for datatable
const theme = createTheme("myTheme", {
    background: {
        default: "transparent",
    },
    divider: {
        default: "transparent",
    },
});

export default customStyles;
export { theme };
