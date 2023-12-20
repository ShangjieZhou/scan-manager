import { Box } from "@mui/system";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from "react";
import { make_request } from "../../helpers.js";
import { Button, TablePagination } from '@mui/material';
import CaseBar from "../../components/caseBar/CaseBar.jsx";
import "./CasesPage.scss";
import { useNavigate } from 'react-router-dom';
import { HeaderBar } from "../../components/headerBar/HeaderBar.jsx";
import PageWrapper from "../pageWrapper/PageWrapper.jsx";

export function CasesPage() {
    const [loading, setLoading] = useState(false);
    const [cases, setCases] = useState([]);
    const [casesCount, setCasesCount] = useState(0);
    const [pageIndex, setPageIndex] = useState(0);
    const [nextPageLink, setNextPageLink] = useState(null);
    const navigator = useNavigate()

    // get first 10 cases when entering
    useEffect(() => {
        fetchCases();
    }, [])

    const fetchCases = async () => {
        const cases = await make_request("/api/case/", "GET");
        console.log(cases.results);
        setLoading(false);
        setCases(cases.results);
        setCasesCount(cases.count);
    }

    const annotateCase = (id) => {
        navigator("/annotation-steps/" + id);
    }

    const currPageCases = () => {
        const currCases = cases.slice(pageIndex * 10, pageIndex * 10 + 10);
        return currCases.map(c => <CaseBar
            onClick={() => annotateCase(c.id)}
            key={c.id}
            data={c}
        />)

    }

    const handleChangePage = async (_, newPage) => {
        // an unfetched page
        if (newPage * 10 + 1 > cases.length) {
            setLoading(true);
            const res = await make_request(`/api/case/?page=${newPage + 1}`, "GET");
            setCases(cases.concat(res.results));
            setLoading(false);
        }
        setPageIndex(newPage);
    };

    return <PageWrapper>
        <div className="case-page" id="cases-page">
            {loading && <CircularProgress />}
            {!loading && <div id="cases-card">
                <h1>Your Cases</h1>
                <div className="row">
                    <Button sx={{ height: "2.2rem" }} onClick={() => navigator("/cases-list/create")} variant="contained">Create</Button>
                    <TablePagination
                        component="div"
                        count={casesCount}
                        page={pageIndex}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[10]}
                        rowsPerPage={10}
                    />
                </div>

                <div id="case-list">
                    <div id="case-bar-title" className="casebar">
                        <h2>Patient Name</h2>
                        <h2>Side</h2>
                        <h2>Date of Surgery</h2>
                        <h2>Case ID</h2>
                        <h2>Status</h2>
                        <h2>Date of Creation</h2>
                    </div>
                    {[...currPageCases()]}
                </div>
            </div>}
        </div>
    </PageWrapper>

}