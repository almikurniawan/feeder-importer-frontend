import { CardContent, Chip } from '@mui/material';
import { Button, Grid, Box, Toolbar, Typography, CssBaseline, Container, Card, Paper, TextField } from '@mui/material';
import Header from '../components/header';
import MenuFeeder from '../components/menu';
import { DataGrid } from '@mui/x-data-grid';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const columns = [
    { field: 'nim', headerName: 'NIM', width: 70 },
    { field: 'nama', headerName: 'Nama', width: 130 },
    { field: 'kode_mk', headerName: 'Kode MK', width: 100 },
    { field: 'nama_mk', headerName: 'Nama MK', width: 130 },
    { field: 'nama_kelas', headerName: 'Nama Kelas', width: 130 },
    { field: 'nilai_huruf', headerName: 'Nilai Huruf', width: 70 },
    { field: 'nilai_indek', headerName: 'Nilai Indek', width: 70 },
    { field: 'nilai_angka', headerName: 'Nilai Angka', width: 70 },
    {
        field: 'status_error', headerName: 'Status', width: 150, renderCell: (params) => {
            return (
                <div>
                    {
                        (params.row.status_error == 0) ? <Chip label="Belum Dieksekusi" variant="filled" /> : (params.row.status_error == 1) ? <Chip label="Sukses" variant="outlined" color='success' /> : <div><Chip label="Error" variant="outlined" color='error' /> {params.row.keterangan}</div>
                    }
                </div>
            )
        },
        sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
    },
];

export default function Home(props) {
    const [username, setUsername] = useState('');
    const [pasword, setPasword] = useState('');
    const router = useRouter();

    const login = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/login/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'username': username,
                'password': pasword
            })
        });

        const res = await result.json();
        if (res.status) {
            localStorage.setItem('token', res.token);
            router.push('/');
        } else {
            alert(res.message);
        }
    }

    return (
        <Container>
            <CssBaseline />
            <Typography variant="h3" align='center' gutterBottom sx={{mt : 10, mx: 40}}>
                Neo Feeder Importer
            </Typography>
            <Card sx={{ mt: 5, mx: 40 }}>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6" gutterBottom>
                                Login
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                id="username"
                                name="username"
                                label="Username"
                                fullWidth
                                autoComplete="username"
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField

                                required
                                id="password"
                                name="password"
                                label="Password"
                                fullWidth
                                type="password"
                                autoComplete="current-password"
                                onChange={(e) => setPasword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" color="primary" onClick={() => login()}>
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

        </Container>
    )
}
