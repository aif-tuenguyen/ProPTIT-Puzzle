import { Card, Box, useTheme } from '@mui/material';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';
import { useEffect, useState } from 'react';
import orderServices from 'src/services/orderServices';

function VisitorsOverview() {
  const theme = useTheme();

  const [listTime, setListTime] = useState([]);
  const [listNumberOfOrders, setListNumberOfOrders] = useState([]);

  const getListTime = async () => {
    const list = [];
    const listValue = [];
    let monthNow = new Date().getMonth() + 1;
    let yearNow = new Date().getFullYear();

    let dem = 0;

    while (dem < 12) {
      while (monthNow >= 1) {
        list.push(`Tháng ${monthNow}/${yearNow}`);
        const response = await orderServices.getNumberOfOrders(
          monthNow,
          yearNow
        );
        listValue.push(response.data);
        monthNow--;
        dem++;
        if (dem === 12) {
          break;
        }
      }

      if (monthNow < 1) {
        yearNow--;
        monthNow = 12;
      }
    }

    setListTime(list.reverse());
    setListNumberOfOrders(listValue.reverse());
  };

  useEffect(() => {
    getListTime();
  }, []);

  const chartOptions: ApexOptions = {
    stroke: {
      curve: 'smooth',
      width: [0, 5]
    },
    theme: {
      mode: theme.palette.mode
    },
    chart: {
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    markers: {
      hover: {
        sizeOffset: 2
      },
      shape: 'circle',
      size: 6,
      strokeWidth: 3,
      strokeOpacity: 1,
      strokeColors: theme.colors.alpha.white[100],
      colors: [theme.colors.error.main]
    },
    colors: [theme.colors.primary.main, theme.colors.error.main],
    fill: {
      opacity: 1
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 8,
        columnWidth: '20%'
      }
    },
    labels: listTime,
    dataLabels: {
      enabled: false
    },
    grid: {
      strokeDashArray: 5,
      borderColor: theme.palette.divider
    },
    legend: {
      show: false
    },
    xaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      tickAmount: 6,
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    }
  };

  const chartData = [
    {
      name: 'Số đơn hàng',
      type: 'column',
      data: listNumberOfOrders
    }
  ];

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box
        sx={{
          p: 3
        }}
      >
        <Chart
          options={chartOptions}
          series={chartData}
          type="line"
          height={250}
        />
      </Box>
    </Card>
  );
}

export default VisitorsOverview;
