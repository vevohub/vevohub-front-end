import * as Yup from 'yup';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import React, {useMemo, useState, useCallback} from 'react';

import Box from '@mui/material/Box';
import Tab from "@mui/material/Tab";
import Card from '@mui/material/Card';
import Tabs from "@mui/material/Tabs";
import Stack from '@mui/material/Stack';
import {Container} from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import {paths} from 'src/routes/paths';
import {useRouter} from 'src/routes/hooks';

import {countries} from 'src/assets/data';

import {useSnackbar} from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

import {IUserItem} from 'src/types/user';

import Iconify from "../../components/iconify";
import AccountNotifications from "../account/account-notifications";
import AccountChangePassword from "../account/account-change-password";

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUserItem;
};

const TABS = [
  {
    value: 'general',
    label: 'General',
    icon: <Iconify icon="solar:user-id-bold" width={24}/>,
  },
  {
    value: 'trello',
    label: 'Trello',
    icon: <Iconify icon="ic:round-vpn-key" width={24}/>,
  },
  {
    value: 'notes',
    label: 'Notes',
    icon: <Iconify icon="solar:bell-bing-bold" width={24}/>,
  },
];
export default function UserNewEditForm({currentUser}: Props) {
  const router = useRouter();

  const [currentTab, setCurrentTab] = useState('general');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const {enqueueSnackbar} = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    // company: Yup.string().required('Company is required'),
    // state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    profile: Yup.string().required('Profile is required'),
    // zipCode: Yup.string().required('Zip code is required'),
    avatarUrl: Yup.mixed<any>().nullable().required('Avatar is required'),
    // not required
    status: Yup.string(),
    isVerified: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      city: currentUser?.city || '',
      profile: currentUser?.profile || '',
      email: currentUser?.email || '',
      // state: currentUser?.state || '',
      status: currentUser?.status || '',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      // zipCode: currentUser?.zipCode || '',
      // company: currentUser?.company || '',
      avatarUrl: currentUser?.avatarUrl || null,
      phoneNumber: currentUser?.phoneNumber || '',
      isVerified: currentUser?.isVerified || true,
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: {isSubmitting},
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.profiles.list);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('avatarUrl', newFile, {shouldValidate: true});
      }
    },
    [setValue]
  );

  return (

    <Container>
      <Typography variant="h6" gutterBottom />
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: {xs: 3, md: 5},
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value}/>
        ))}
      </Tabs>


      {currentTab === 'general' && <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          <Grid xs={12} md={10}>
            <Card sx={{p: 3}}>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
                <RHFTextField name="name" label="Full Name"/>
                <RHFTextField name="email" label="Email Address"/>
                <RHFTextField name="phoneNumber" label="Phone Number"/>

                <RHFAutocomplete
                  name="country"
                  type="country"
                  label="Country"
                  placeholder="Choose a country"
                  fullWidth
                  options={countries.map((option) => option.label)}
                  getOptionLabel={(option) => option}
                />

                <RHFTextField name="state" label="State/Region"/>
                <RHFTextField name="city" label="City"/>
                <RHFTextField name="address" label="Address"/>
                <RHFTextField name="zipCode" label="Zip/Code"/>
                <RHFTextField name="company" label="Company"/>
                <RHFTextField name="role" label="Role"/>
              </Box>

              <Stack alignItems="flex-end" sx={{mt: 3}}>
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!currentUser ? 'Create User' : 'Save Changes'}
                </LoadingButton>
              </Stack>
            </Card>
          </Grid>

          <Grid xs={12} md={8} />
        </Grid>
      </FormProvider>}

      {currentTab === 'notifications' && <AccountNotifications />}

      {currentTab === 'security' && <AccountChangePassword />}

    </Container>
  );
}
