import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Divider,
  Box,
  useTheme,
  styled
} from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import categoryServices from 'src/services/categoryServices';
import randomColor from 'randomcolor';

const DotLegend = styled('span')(
  ({ theme }) => `
    border-radius: 22px;
    width: ${theme.spacing(1.5)};
    height: ${theme.spacing(1.5)};
    display: inline-block;
    margin-right: ${theme.spacing(0.5)};
`
);

function SalesByCategory() {
  const theme = useTheme();

  const [categoryStatistic, setCategoryStatistic] = useState([]);

  const [colors, setColors] = useState([]);

  const getStatisticCategory = async () => {
    const response = await categoryServices.getStatisticCategories();
    if (response.status === 200) {
      setCategoryStatistic(response.data);

      setColors(
        response.data.map((item) => {
          const color = randomColor();
          return color;
        })
      );
    }
  };

  useEffect(() => {
    getStatisticCategory();
  }, []);

  const sales = {
    datasets: [
      {
        backgroundColor: colors
      }
    ],
    labels: categoryStatistic?.map((item) => item.category.name)
  };

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '55%'
        }
      }
    },
    colors,
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        console.log(val);

        return Math.floor(Number(val)) + '%';
      },
      dropShadow: {
        enabled: true,
        top: 1,
        left: 1,
        blur: 1,
        color: theme.colors.alpha.black[50],
        opacity: 0.5
      }
    },
    fill: {
      opacity: 1
    },
    labels: sales.labels,
    legend: {
      labels: {
        colors: theme.colors.alpha.trueWhite[100]
      },
      show: false
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    }
  };

  const chartSeries = categoryStatistic?.map((item) => item.series);

  return (
    <Card>
      <CardHeader title={'Thống kê danh mục'} />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid
            md={6}
            item
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Chart
              height={228}
              options={chartOptions}
              series={chartSeries}
              type="donut"
            />
          </Grid>
          <Grid md={6} item display="flex" alignItems="center">
            <Box>
              {sales.labels.map((label: string, i: number) => (
                <Typography
                  key={label}
                  variant="body2"
                  sx={{
                    py: 0.8,
                    display: 'flex',
                    alignItems: 'center',
                    mr: 2
                  }}
                >
                  <DotLegend
                    style={{
                      background: `${sales.datasets[0].backgroundColor[i]}`
                    }}
                  />
                  <span
                    style={{
                      paddingRight: 10,
                      color: `${sales.datasets[0].backgroundColor[i]}`
                    }}
                  >
                    {chartSeries[i]}%
                  </span>
                  {label}
                </Typography>
              ))}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default SalesByCategory;
