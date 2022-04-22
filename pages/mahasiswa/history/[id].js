import { CardContent, Grid, Icon, LinearProgress, Menu, Modal } from '@mui/material';
import { Box, Toolbar, Typography, CssBaseline, FormControl, TextField, Card, Chip, InputLabel, Select, MenuItem, Button } from '@mui/material';
import Header from '../../../components/header';
import MenuFeeder from '../../../components/menu';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { blue } from '@mui/material/colors';
import { DataGrid } from '@mui/x-data-grid';
import MenuIcon from '@mui/icons-material/Menu';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const columns = [
    { field: 'nama_mahasiswa', headerName: 'nama_mahasiswa', width: 150 },
    { field: 'jenis_kelamin', headerName: 'jenis_kelamin', width: 100 },
    { field: 'tempat_lahir', headerName: 'tempat_lahir', width: 100 },
    { field: 'tanggal_lahir', headerName: 'tanggal_lahir', width: 100 },
    { field: 'id_agama', headerName: 'id_agama', width: 100 },
    { field: 'nik', headerName: 'nik', width: 100 },
    { field: 'nisn', headerName: 'nisn', width: 100 },
    { field: 'kewarganegaraan', headerName: 'kewarganegaraan', width: 100 },
    { field: 'jalan', headerName: 'jalan', width: 100 },
    { field: 'dusun', headerName: 'dusun', width: 100 },
    { field: 'rt', headerName: 'rt', width: 100 },
    { field: 'rw', headerName: 'rw', width: 100 },
    { field: 'kelurahan', headerName: 'kelurahan', width: 100 },
    { field: 'kode_pos', headerName: 'kode_pos', width: 100 },
    { field: 'id_wilayah', headerName: 'id_wilayah', width: 100 },
    { field: 'id_jenis_tinggal', headerName: 'id_jenis_tinggal', width: 100 },
    { field: 'id_alat_transportasi', headerName: 'id_alat_transportasi', width: 100 },
    { field: 'telepon', headerName: 'telepon', width: 100 },
    { field: 'handphone', headerName: 'handphone', width: 100 },
    { field: 'email', headerName: 'email', width: 100 },
    { field: 'penerima_kps', headerName: 'penerima_kps', width: 100 },
    { field: 'nomor_kps', headerName: 'nomor_kps', width: 100 },
    { field: 'nik_ayah', headerName: 'nik_ayah', width: 100 },
    { field: 'nama_ayah', headerName: 'nama_ayah', width: 100 },
    { field: 'tanggal_lahir_ayah', headerName: 'tanggal_lahir_ayah', width: 100 },
    { field: 'id_pendidikan_ayah', headerName: 'id_pendidikan_ayah', width: 100 },
    { field: 'id_pekerjaan_ayah', headerName: 'id_pekerjaan_ayah', width: 100 },
    { field: 'id_penghasilan_ayah', headerName: 'id_penghasilan_ayah', width: 100 },
    { field: 'nik_ibu', headerName: 'nik_ibu', width: 100 },
    { field: 'nama_ibu_kandung', headerName: 'nama_ibu_kandung', width: 100 },
    { field: 'tanggal_lahir_ibu', headerName: 'tanggal_lahir_ibu', width: 100 },
    { field: 'id_pendidikan_ibu', headerName: 'id_pendidikan_ibu', width: 100 },
    { field: 'id_pekerjaan_ibu', headerName: 'id_pekerjaan_ibu', width: 100 },
    { field: 'id_penghasilan_ibu', headerName: 'id_penghasilan_ibu', width: 100 },
    { field: 'npwp', headerName: 'npwp', width: 100 },
    { field: 'nama_wali', headerName: 'nama_wali', width: 100 },
    { field: 'tanggal_lahir_wali', headerName: 'tanggal_lahir_wali', width: 100 },
    { field: 'id_pendidikan_wali', headerName: 'id_pendidikan_wali', width: 100 },
    { field: 'id_pekerjaan_wali', headerName: 'id_pekerjaan_wali', width: 100 },
    { field: 'id_penghasilan_wali', headerName: 'id_penghasilan_wali', width: 100 },
    { field: 'id_kebutuhan_khusus_mahasiswa', headerName: 'id_kebutuhan_khusus_mahasiswa', width: 100 },
    { field: 'id_kebutuhan_khusus_ayah', headerName: 'id_kebutuhan_khusus_ayah', width: 100 },
    { field: 'id_kebutuhan_khusus_ibu', headerName: 'id_kebutuhan_khusus_ibu', width: 100 },
    { field: 'nim', headerName: 'nim', width: 100 },
    { field: 'daftar_nama', headerName: 'daftar_nama', width: 100 },
    { field: 'id_periode_masuk', headerName: 'id_periode_masuk', width: 100 },
    { field: 'kode_jurusan', headerName: 'kode_jurusan', width: 100 },
    { field: 'id_bidang_minat', headerName: 'id_bidang_minat', width: 100 },
    { field: 'id_perguruan_tinggi_asal', headerName: 'id_perguruan_tinggi_asal', width: 100 },
    { field: 'nama_perguruan_tinggi_asal', headerName: 'nama_perguruan_tinggi_asal', width: 100 },
    { field: 'nama_prodi_asal', headerName: 'nama_prodi_asal', width: 100 },
    { field: 'sks_diakui', headerName: 'sks_diakui', width: 100 },
    { field: 'biaya_nama', headerName: 'biaya_nama', width: 100 },
    {
        field: 'biaya_masuk', headerName: 'biaya_masuk', width: 100, renderCell: (params) => {
            return (
                <div>
                    {
                        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(params.row.biaya_masuk)
                    }
                </div>
            )
        },
        sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
    },
    { field: 'tanggal_daftar', headerName: 'tanggal_daftar', width: 100 },
    { field: 'masuk_nama', headerName: 'masuk_nama', width: 100 },
    {
        field: 'status_error', headerName: 'Status', width: 150, renderCell: (params) => {
            return (
                <div>
                    {
                        (params.row.status_error == 0) ? <Chip label="Belum Dieksekusi" variant="filled" /> : (params.row.status_error == 1) ? <Chip label="Sukses" variant="outlined" color='success' /> : <div><Chip label="Error" variant="outlined" color='error' /> <br /> {params.row.keterangan}</div>
                    }
                </div>
            )
        },
        sortComparator: (v1, v2) => v1.name.localeCompare(v2.name)
    },
];

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export default function Home(props) {

    const [isBussy, setBussy] = useState(false);
    const [isBussyDelete, setBussyDelete] = useState(false);
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [rowSelected, setRowSelected] = useState([]);
    const [totalData, setTotalData] = useState(0);
    const [proses, setProses] = useState(0);
    const [totalProses, setTotalProses] = useState(0);
    const [filter, setFilter] = useState([]);


    // area edit dan modal
    const [modalPembiayaan, setModalPembiayaan] = useState(false);
    const [pembiayaan, setPembiayaan] = useState(0);
    const [modalJalurMasuk, setModalJalurMasuk] = useState(false);
    const [jalurMasuk, setJalurMasuk] = useState(0);
    const [modalBiaya, setModalBiaya] = useState(false);
    const [biaya, setBiaya] = useState(0);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        getData();
    }, [page, filter]);

    const getData = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/mahasiswa/' + id + '?page=' + (page + 1), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'filter': filter
            })
        });

        const res = await result.json();
        setBussy(false);
        if (res.status) {
            setData(res.data.rows);
            setTotalData(res.data.pager.total);
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const savePembiayaan = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/updatePembiayaan/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'pembiayaan': pembiayaan,
            })
        });

        const res = await result.json();
        if (res.status) {
            setModalPembiayaan(false);
            getData();
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const saveJalurMasuk = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/updateJalurMasuk/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'jalurMasuk': jalurMasuk,
            })
        });

        const res = await result.json();
        if (res.status) {
            setModalJalurMasuk(false);
            getData();
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const saveBiaya = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/updateBiaya/' + id + '?page=' + page, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                'id': rowSelected,
                'biaya': biaya,
            })
        });

        const res = await result.json();

        if (res.status) {
            setModalBiaya(false);
            getData();
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }


    const pushNeoFeeder = async (data) => {
        setBussy(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/push/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });

        const res = await result.json();
        if (res.status) {
            getProgress();
        } else {
            setBussy(false);
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    const getProgress = async () => {
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/progress/' + id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
        });

        const res = await result.json();
        if (res.data.mhs_head_eksekusi_total == null) {
            setTimeout(() => {
                getProgress();
            }, 10000);
        } else {
            setProses(res.data.mhs_head_eksekusi);
            setTotalProses(res.data.mhs_head_eksekusi_total);
            if (parseInt(res.data.mhs_head_eksekusi) < parseInt(res.data.mhs_head_eksekusi_total)) {
                setTimeout(() => {
                    getProgress();
                }, 10000);
            }
            else {
                setBussy(false);
                getData();
            }
        }
    }

    const deleteData = async () => {
        setBussyDelete(true);
        const result = await fetch('http://192.168.0.35/feeder-backend/public/api/mahasiswa/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                id: rowSelected
            })
        });

        const res = await result.json();
        setBussyDelete(false);
        if (res.status) {
            getData();
        } else {
            if (res.message == 'Unauthorized access') {
                localStorage.removeItem('token');
                router.push('/login');
            } else {
                alert('Terjadi Kesalahan ' + res.message);
            }
        }
    }

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ display: 'flex' }}>
                <Modal
                    open={modalPembiayaan}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Pembiayaan
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                sx={{
                                    width: 500,
                                    maxWidth: '100%',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item md={12}>
                                        <FormControl
                                            sx={{ width: '100%' }}
                                        >
                                            <InputLabel id="label-tahun">Pembiayaan</InputLabel>
                                            <Select
                                                labelId='label-tahun'
                                                id="label-tahun"
                                                value={pembiayaan}
                                                label="Pembiayaan"
                                                onChange={(e) => setPembiayaan(e.target.value)}
                                            >
                                                {
                                                    props.refPembiayaan.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item.biaya_id} key={index}>{item.biaya_nama}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                savePembiayaan();
                                            }}
                                        > Simpan</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={modalJalurMasuk}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Jalur Masuk
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                sx={{
                                    width: 500,
                                    maxWidth: '100%',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item md={12}>
                                        <FormControl
                                            sx={{ width: '100%' }}
                                        >
                                            <InputLabel id="label-tahun">Jalur Masuk</InputLabel>
                                            <Select
                                                labelId='label-tahun'
                                                id="label-tahun"
                                                value={jalurMasuk}
                                                label="Jalur Masuk"
                                                onChange={(e) => setJalurMasuk(e.target.value)}
                                            >
                                                {
                                                    props.refJalurMasuk.map((item, index) => {
                                                        return (
                                                            <MenuItem value={item.masuk_id} key={index}>{item.masuk_nama}</MenuItem>
                                                        )
                                                    })
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveJalurMasuk();
                                            }}
                                        > Simpan</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <Modal
                    open={modalBiaya}
                >
                    <Box sx={style}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Biaya Masuk
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <Box
                                component="form"
                                noValidate
                                autoComplete="off"
                                sx={{
                                    width: 500,
                                    maxWidth: '100%',
                                }}
                            >
                                <Grid container spacing={2}>
                                    <Grid item md={12}>
                                        <TextField label="Biaya Masuk" variant="outlined" value={biaya}
                                            onChange={(e) => setBiaya(e.target.value)} sx={{ width: '100%' }}

                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <Button variant="contained"
                                            onClick={() => {
                                                saveBiaya();
                                            }}
                                        > Simpan</Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Typography>
                    </Box>
                </Modal>

                <CssBaseline />
                <Header />
                <MenuFeeder />
                <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }} color>
                    <Toolbar />
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="h5" gutterBottom align='left'>
                                List Mahasiswa
                            </Typography>
                            <Button variant="contained"
                                disabled={isBussy}
                                color="secondary"
                                onClick={() => {
                                    setBussy(true);
                                    pushNeoFeeder();
                                }}
                            > {
                                    (isBussy) ? <ClipLoader size={24} color={blue[500]} css={{ marginRight: '5px' }} /> : <></>
                                } Push ke Neo Feeder</Button>

                            <Button variant="contained"
                                disabled={isBussyDelete}
                                color="error"
                                onClick={() => {
                                    setBussyDelete(true);
                                    deleteData();
                                }}
                                style={{ float: 'right' }}
                            > {
                                    (isBussyDelete) ? <ClipLoader size={24} color={blue[500]} css={{ marginRight: '5px' }} /> : <></>
                                } Hapus Data</Button>

                            <div
                                style={{ float: 'right', marginRight: '10px' }}
                            >
                                <Button variant="contained"
                                    disabled={isBussyDelete}
                                    color="warning"
                                    onClick={(event) => {
                                        setAnchorEl(event.currentTarget);
                                    }}
                                    id="demo-positioned-button"
                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                > <MenuIcon /> Edit</Button>
                                <Menu
                                    id="demo-positioned-menu"
                                    aria-labelledby="demo-positioned-button"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                >
                                    <MenuItem id='menu-1' onClick={(e) => {
                                        setModalPembiayaan(true);
                                    }}>Pembiayaan Awal</MenuItem>
                                    <MenuItem id='menu-1' onClick={(e) => {
                                        setModalJalurMasuk(true);
                                    }}>Jalur Masuk</MenuItem>
                                    <MenuItem id='menu-1' onClick={(e) => {
                                        setModalBiaya(true);
                                    }}>Biaya Masuk</MenuItem>
                                </Menu>
                            </div>


                            {
                                (isBussy) ?
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <LinearProgress variant="determinate" value={(proses / totalProses * 100)} />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography variant="body1" gutterBottom align='left'>
                                                Proses import data ke {proses} dari {totalProses} data
                                            </Typography>
                                        </Grid>
                                    </Grid> : <></>
                            }
                            <div style={{ height: '100vh', width: '100%', marginTop: '15px' }}>
                                <DataGrid
                                    rows={data}
                                    columns={columns}
                                    pageSize={100}
                                    rowsPerPageOptions={[100]}
                                    rowCount={totalData}
                                    page={page}
                                    checkboxSelection
                                    onSelectionModelChange={(ids) => {
                                        setRowSelected(ids);
                                    }}
                                    paginationMode="server"
                                    onPageChange={(e) => {
                                        setPage(e);
                                    }}
                                    onSortModelChange={(model, detail) => {

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
        </LocalizationProvider>
    )
}

export async function getServerSideProps({ params }) {
    const res = await fetch('http://192.168.0.35/feeder-backend/public/pembiayaan');
    const pembiayaan = await res.json();

    const resMasuk = await fetch('http://192.168.0.35/feeder-backend/public/jalurMasuk');
    const jalurMasuk = await resMasuk.json();

    return {
        props: {
            'id': params.id,
            'refPembiayaan': pembiayaan,
            'refJalurMasuk': jalurMasuk
        },
    }
}