import { CardContent, Grid, LinearProgress } from '@mui/material';
import { Box, Toolbar, Typography, CssBaseline, Card, Chip, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Header from '../../../components/header';
import MenuFeeder from '../../../components/menu';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';

const columns = [
    { field: 'jur_nama', headerName: 'Jurusan', width: 150 },
    { field: 'tahun_label', headerName: 'Thn. Ajaran', width: 100 },
    { field: 'sms_nama', headerName: 'Sms. Ajaran', width: 150 },
    { field: 'nil_head_catatan', headerName: 'Catatan', width: 130 },
    { field: 'nil_head_total', headerName: 'Jumlah Record', width: 130 },
    { field: 'user_fullname', headerName: 'Oleh', width: 150, renderCell: (params) => {
        return (
            <>{params.row.user_fullname} <br/>pada : {params.row.nil_head_created_at}</>
        );
    }},
    {
        field: 'status_error', headerName: 'Action', width: 150, renderCell: (params) => {
            return (
                <Link href={"/nilai/history/"+params.row.nil_head_id}>
                  <Button style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                  }}>Detail</Button>
                </Link>
            )
        },
        sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
    },
];

export default function Home() {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [filter, setFilter] = useState([]);
    const router = useRouter();

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [page, filter]);

    const getData = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/nilai/history?page=' + (page+1),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'filter' : filter
            })
        });
        const res = await result.json();
        if (res.status) {
            setData(res.data.nilai);
            setTotalData(res.data.pager.total);
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            }else{
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }


    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Header />
            <MenuFeeder />
            <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }} color>
                <Toolbar />
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h5" gutterBottom align='left'>
                            List History Import Nilai
                        </Typography>
                        <div style={{ height: '100vh', width: '100%', marginTop: '15px' }}>
                            <DataGrid
                                getRowId={(row) => row.nil_head_id}
                                rows={data}
                                columns={columns}
                                pageSize={20}
                                rowsPerPageOptions={[20]}
                                rowCount={totalData}
                                page={page}
                                paginationMode="server"
                                onPageChange={(e) => {
                                    setPage(e);
                                }}
                                onFilterModelChange={
                                    (model, details) => {
                                        setFilter(model.items);
                                    }
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}