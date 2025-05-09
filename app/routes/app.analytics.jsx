import React from "react";
import { Layout, Page, Card, Grid } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJs } from "chart.js/auto";
function Analytics() {
  return (
    <>
      <Page fullWidth>
      <TitleBar title="Analytics" /> 
        <Layout>
          <Layout.Section >
            <Grid>
              <Grid.Cell columnSpan={{ xs: 12, md: 6 }}>
                <Card title="Sales by Product" sectioned>
                  <Bar
                    data={{
                      labels: ["Product A", "Product B", "Product C"],
                      datasets: [
                        {
                          label: "Sales",
                          data: [12, 19, 3],
                          backgroundColor: ["rgba(75,192,192,1)"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </Card>
              </Grid.Cell>
              <Grid.Cell columnSpan={{ xs: 12, md: 6 }}>
                <Card title="Sales by Region" sectioned>
                  <Bar
                    data={{
                      labels: ["North", "South", "East", "West"],
                      datasets: [
                        {
                          label: "Sales",
                          data: [5, 10, 15, 20],
                          backgroundColor: ["rgba(153,102,255,1)"],
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      plugins: {
                        legend: {
                          position: "top",
                        },
                      },
                    }}
                  />
                </Card>
              </Grid.Cell>


            </Grid>
          </Layout.Section>
        </Layout>
      </Page>
    </>
  );
}
export default Analytics;
