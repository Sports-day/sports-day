import { lazy, Suspense } from 'react';
import { styled } from '@mui/material/styles';

const ApexChart = lazy(() => import('react-apexcharts'));

const StyledApexChart = styled(ApexChart)``;

export const Chart = (props: any) => (
    <Suspense fallback={null}>
        <StyledApexChart {...props} />
    </Suspense>
);
