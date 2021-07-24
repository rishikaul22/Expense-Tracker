import React from 'react';
import * as moneyloading from '../animations/moneyloading.json';
import * as transactionloading from '../animations/transaction.json';

import classnames from 'classnames';

import Chart from 'chart.js';

import { Line, Bar } from 'react-chartjs-2';

import { FaRupeeSign } from 'react-icons/fa';
import { CgNotes } from 'react-icons/cg';
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Label,
} from 'reactstrap';

// core components
import {
  chartOptions,
  parseOptions,
  //   chartExample1,
  chartExample2,
  colors,
  chartExample3,
} from 'variables/charts.js';

import Header from 'components/Headers/Header.js';

import AdminNavbar from '../components/Navbars/AdminNavbar';
import AdminFooter from '../components/Footers/AdminFooter';
import axios from 'axios';
import Lottie from 'react-lottie';
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: moneyloading.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
const transactionLoading = {
  loop: true,
  autoplay: true,
  animationData: transactionloading.default,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

class DashboardPage extends React.Component {
  names = ['Priyav', 'Harsh', 'Rahul', 'Rishi', 'Vrutik'];
  //   userid = localStorage.getItem('userid');
  //   token = localStorage.getItem('Authorization');
  // profileName = this.props.location.state.name
  addTransaction = async () => {
    this.setState({ ...this.state, transactionLoader: true });
    let transaction = {
      amount: this.state.amount,
      description: this.state.description,
      type: this.state.type,
      day: this.state.day,
      month: this.state.month,
      year: this.state.year,
    };
    console.log(transaction);
    const res = await axios
      .post(
        `https://rpk-expense-tracker.herokuapp.com/${sessionStorage.getItem(
          'userid'
        )}`,
        transaction,
        { headers: { Authorization: sessionStorage.getItem('Authorization') } }
      )
      .then((response) => {
        console.log(response);
        // this.assignData(response);
        setTimeout(() => {
          this.assignData(response);
        }, 2000);
        this.setState({
          ...this.state,
          transactionLoader: false,
          amount: '',
          description: '',
          day: null,
          month: null,
          year: null,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  chartExample1 = {
    options: {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: '#FFFFFF',
              zeroLineColor: '#FFFFFF',
            },
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  return 'Rs. ' + value;
                }
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || '';
            var yLabel = item.yLabel;
            var content = '';

            if (data.datasets.length > 1) {
              content += label;
            }

            content += 'Rs. ' + yLabel;
            return content;
          },
        },
      },
    },
    data1: (canvas) => {
      return {
        labels: [
          'Jan',
          'Feb',
          'March',
          'April',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Performance',
            data: this.state.expense
              ? this.state.expenseGraph
              : [0, 20, 40, 30, 15, 200, 20, 60, 60, 90, 160, 100],
          },
        ],
      };
    },
    data2: (canvas) => {
      return {
        labels: [
          'Jan',
          'Feb',
          'March',
          'April',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Performance',
            data: this.state.income
              ? this.state.incomeGraph
              : [0, 20, 40, 30, 15, 200, 20, 60, 60, 90, 160, 100],
          },
        ],
      };
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      activeNav: 1,
      chartExample1Data: 'data1',
      isIncome: true,
      income: false,
      expense: false,
      loading: false,
      data: {},
      expenses: [],
      showMore: false,
      profileName: '',
      description: '',
      type: 'Income',
      amount: '',
      day: null,
      month: null,
      year: null,
      transactionLoader: false,
      incomeData: {
        labels: [
          'Jan',
          'Feb',
          'March',
          'April',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Performance',
            data: [0, 20, 40, 30, 15, 200, 20, 60, 60, 90, 160, 100],
          },
        ],
      },
      expenseData: {
        labels: [
          'Jan',
          'Feb',
          'March',
          'April',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
        datasets: [
          {
            label: 'Performance',
            data: [0, 40, 100, 80, 90, 50, 200],
          },
        ],
      },
      expenseGraph: [],
      incomeGraph: [],
      chartExample2: {
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function (value) {
                    if (!(value % 10)) {
                      //return '$' + value + 'k'
                      return value;
                    }
                  },
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function (item, data) {
                var label = data.datasets[item.datasetIndex].label || '';
                var yLabel = item.yLabel;
                var content = '';
                if (data.datasets.length > 1) {
                  content += label;
                }
                content += yLabel;
                return content;
              },
            },
          },
        },
        data: {
          labels: [
            'Jan',
            'Feb',
            'March',
            'April',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          datasets: [
            {
              label: 'Sales',
              data: [25, 20, 30, 22, 17, 29],
              maxBarThickness: 10,
            },
          ],
        },
      },
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  async componentDidMount() {
    this.setState({ ...this.state, loading: true });
    const res = await axios
      .get(
        `https://rpk-expense-tracker.herokuapp.com/dashboard/${sessionStorage.getItem(
          'userid'
        )}`,
        { headers: { Authorization: sessionStorage.getItem('Authorization') } }
      )
      .then((res) => {
        console.log(res);
        this.assignData(res);
      });
  }
  assignData = (res) => {
    var e = res.data.expensedf;
    var i = res.data.incomedf;
    var savings = [];
    if (e && i) {
      for (var m = 0; m < e.length; m++) {
        if (i[m] - e[m] > 0) {
          savings[m] = i[m] - e[m];
        } else {
          savings[m] = 0;
        }
      }
    }
    console.log(savings);
    this.setState({
      ...this.state,
      income: true,
      expense: true,
      loading: false,
      data: res.data,
      expenses: res.data.transactions,
      profileName: res.data.name,
      expenseGraph: res.data.expensedf,
      incomeGraph: res.data.incomedf,
      chartExample2: {
        options: {
          scales: {
            yAxes: [
              {
                ticks: {
                  callback: function (value) {
                    if (!(value % 10)) {
                      //return '$' + value + 'k'
                      return value;
                    }
                  },
                },
              },
            ],
          },
          tooltips: {
            callbacks: {
              label: function (item, data) {
                var label = data.datasets[item.datasetIndex].label || '';
                var yLabel = item.yLabel;
                var content = '';
                if (data.datasets.length > 1) {
                  content += label;
                }
                content += yLabel;
                return content;
              },
            },
          },
        },
        data: {
          labels: [
            'Jan',
            'Feb',
            'March',
            'April',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
          ],
          datasets: [
            {
              label: 'Sales',
              //data: [25, 20, 30, 22, 17, 29],
              data: savings,
              maxBarThickness: 10,
            },
          ],
        },
      },
    });
  };
  toggleNavs = (e, index) => {
    e.preventDefault();

    this.setState({
      ...this.state,
      activeNav: index,
      // chartExample1Data:
      //   this.state.chartExample1Data === 'data1' ? 'data2' : 'data1',
      chartExample1Data: index === 1 ? 'data1' : 'data2',
      income: index === 1 ? true : false,
    });

    console.log(this.state.income);
  };
  graphData(income) {
    if (income) {
      return this.incomeData;
    } else return this.expenseData;
  }
  downloadSheet() {
    window.open(
      `https://rpk-expense-tracker.herokuapp.com/expense/${sessionStorage.getItem(
        'userid'
      )}`
    );
  }
  render() {
    if (this.state.loading) {
      // console.log(this.state.loginSuccess)
      return (
        <>
          <Lottie options={defaultOptions} height={500} width={500} />
        </>
      );
    }
    return (
      <>
        <div className='main-content' ref='mainContent'>
          <AdminNavbar
            {...this.props}
            brandText='Dashboard'
            token={sessionStorage.getItem('Authorization')}
            name={this.state.profileName}
          />
          <Header
            monthly_savings={this.state.data.monthly_savings}
            income={this.state.data.income}
            wallet={this.state.data.wallet}
            expense={this.state.data.expense}
          />
          {/* Page content */}
          <Container className='mt--7' fluid>
            <Row>
              <Col className='mb-5 mb-xl-0' xl='5'>
                <Card className='bg-gradient-default shadow'>
                  <CardHeader className='bg-transparent'>
                    <Row className='align-items-center'>
                      <div className='col'>
                        <h6 className='text-uppercase text-light ls-1 mb-1'>
                          Overview
                        </h6>
                        <h2 className='text-white mb-0'>Expense Analysis</h2>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className='chart'>
                      <Line
                        //data={this.graphData(this.state.income)}
                        data={this.chartExample1['data1']}
                        options={this.chartExample1.options}
                      // getDatasetAtEvent={e => console.log(e)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col xl='4'>
                <Card className='shadow'>
                  <CardHeader className='bg-transparent'>
                    <Row className='align-items-center'>
                      <div className='col'>
                        <h6 className='text-uppercase text-muted ls-1 mb-1'>
                          Overview
                        </h6>
                        <h2 className='mb-0'>Savings per month</h2>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className='chart'>
                      <Bar
                        data={this.state.chartExample2.data}
                        options={this.state.chartExample2.options}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col Col xl='3'>
                <Card className='shadow'>
                  <CardHeader className='bg-transparent'>
                    <Row className='align-items-center'>
                      <div className='col'>
                        {this.state.isIncome == true ? (
                          <h2 className='mb-0'>Add Income</h2>
                        ) : (
                          <h2 className='mb-0'>Add Expense</h2>
                        )}
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    <FormGroup className='mb-3'>
                      <InputGroup className='input-group-alternative'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            {/* <i className="ni ni-email-83" /> */}
                            <FaRupeeSign />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Amount'
                          type='text'
                          value={this.state.amount}
                          autoComplete='new-email'
                          onChange={(e) => {
                            this.setState({
                              ...this.state,
                              amount: Number(e.target.value),
                            });
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <InputGroup className='input-group-alternative'>
                        <InputGroupAddon addonType='prepend'>
                          <InputGroupText>
                            {/* <i className="ni ni-lock-circle-open" /> */}
                            <CgNotes />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder='Description'
                          type='text'
                          value={this.state.description}
                          autoComplete='new-password'
                          onChange={(e) => {
                            this.setState({
                              ...this.state,
                              description: e.target.value,
                            });
                          }}
                        />
                      </InputGroup>
                    </FormGroup>
                    <Row>
                      <div class='custom-control custom-control-alternative custom-radio mb-3 ml-3'>
                        <input
                          name='custom-radio-2'
                          class='custom-control-input'
                          id='customRadio5'
                          value='Income'
                          type='radio'
                          defaultChecked
                          onChange={(e) => {
                            this.setState({
                              ...this.state,
                              isIncome: true,
                              type: 'Income',
                            });
                            console.log(e.target.value);
                          }}
                        />
                        <label class='custom-control-label' for='customRadio5'>
                          Income
                        </label>
                      </div>
                      <div class='custom-control custom-control-alternative custom-radio ml-3'>
                        <input
                          name='custom-radio-2'
                          class='custom-control-input'
                          id='customRadio6'
                          value='Expense'
                          type='radio'
                          onChange={(e) => {
                            this.setState({
                              ...this.state,
                              isIncome: false,
                              type: 'Expense',
                            });
                            console.log(e.target.value);
                          }}
                        />
                        <label class='custom-control-label' for='customRadio6'>
                          Expense
                        </label>
                      </div>
                    </Row>
                    <div class='form-group'>
                      <div class='input-group input-group-alternative'>
                        <div class='input-group-prepend'>
                          <span class='input-group-text'>
                            <i class='ni ni-calendar-grid-58'></i>
                          </span>
                        </div>
                        <input
                          class='form-control text datepicker'
                          placeholder='date placeholder'
                          type='date'
                          name='date'
                          onChange={(e) => {
                            var date = e.target.value;
                            console.log(date);
                            var day = date.split('-')[2];
                            var month = date.split('-')[1];
                            var year = date.split('-')[0];
                            console.log(day + ' ' + month + ' ' + year);
                            this.setState({
                              ...this.state,
                              day: Number(day),
                              month: Number(month),
                              year: Number(year),
                            });
                          }}
                        />
                      </div>
                    </div>
                    {this.state.isIncome == true ? (
                      <button
                        class='btn btn-block btn-success'
                        onClick={this.addTransaction}
                        disabled={this.state.transactionLoader}
                      >
                        Add Income
                      </button>
                    ) : (
                      <button
                        class='btn btn-block btn-danger'
                        onClick={this.addTransaction}
                        disabled={this.state.transactionLoader}
                      >
                        Add Expense
                      </button>
                    )}
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row className='mt-5'>
              <Col className='mb-5 mb-xl-0' xl='5'>
                <Card className='bg-gradient-default shadow'>
                  <CardHeader className='bg-transparent'>
                    <Row className='align-items-center'>
                      <div className='col'>
                        <h6 className='text-uppercase text-light ls-1 mb-1'>
                          Overview
                        </h6>
                        <h2 className='text-white mb-0'>Income Analysis</h2>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}

                    <div className='chart'>
                      <Line
                        //data={this.graphData(this.state.income)}
                        data={this.chartExample1['data2']}
                        options={this.chartExample1.options}
                      // getDatasetAtEvent={e => console.log(e)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col className='mb-5 mb-xl-0' xl='7'>
                <Card className='shadow'>
                  <CardHeader className='border-0'>
                    <Row className='align-items-center'>
                      <div className='col'>
                        <h3 className='mb-0'>Your Transactions</h3>
                      </div>
                      <div className='col text-right'>
                        <Button
                          color='primary'
                          onClick={this.downloadSheet}
                          size='sm'
                        >
                          Download Expense Sheet
                        </Button>
                        <Button
                          color='primary'
                          onClick={(e) => {
                            this.setState({
                              ...this.state,
                              showMore: !this.state.showMore,
                            });
                          }}
                          size='sm'
                        >
                          {this.state.showMore ? 'Show Less' : 'Show More'}
                        </Button>
                      </div>
                    </Row>
                  </CardHeader>
                  <Table className='align-items-center table-flush' responsive>
                    <thead className='thead-light'>
                      <tr>
                        <th scope='col'>Type</th>
                        <th scope='col'>Description</th>
                        <th scope='col'>Date</th>
                        <th scope='col'>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.expenses && this.state.showMore
                        ? this.state.expenses.map((expense) => (
                          <tr>
                            {expense.type == 'Income' ? (
                              <th scope='row' style={{ color: 'green' }}>
                                {expense.type}
                              </th>
                            ) : (
                              <th scope='row' style={{ color: 'red' }}>
                                {expense.type}
                              </th>
                            )}
                            <td>{expense.description}</td>
                            <td>
                              {expense.day} / {expense.month} / {expense.year}
                            </td>
                            <td>
                              {expense.type == 'Income' ? (
                                <i className='fas fa-arrow-up text-success mr-3' />
                              ) : (
                                <i className='fas fa-arrow-down text-warning mr-3' />
                              )}{' '}
                              {expense.amount}
                            </td>
                          </tr>
                        ))
                        : this.state.expenses &&
                        this.state.expenses.slice(0, 5).map((expense) => (
                          <tr>
                            {expense.type == 'Income' ? (
                              <th scope='row' style={{ color: 'green' }}>
                                {expense.type}
                              </th>
                            ) : (
                              <th scope='row' style={{ color: 'red' }}>
                                {expense.type}
                              </th>
                            )}
                            <td>{expense.description}</td>
                            <td>
                              {expense.day} / {expense.month} / {expense.year}
                            </td>
                            <td>
                              {expense.type == 'Income' ? (
                                <i className='fas fa-arrow-up text-success mr-3' />
                              ) : (
                                <i className='fas fa-arrow-down text-warning mr-3' />
                              )}{' '}
                              {expense.amount}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card>
              </Col>
            </Row>
          </Container>
          <Container fluid>
            <AdminFooter />
          </Container>
        </div>
      </>
    );
  }
}

export default DashboardPage;
