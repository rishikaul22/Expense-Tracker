import React from 'react';
import * as moneyloading from '../animations/moneyloading.json';
// node.js library that concatenates classes (strings)
import classnames from 'classnames';
// javascipt plugin for creating charts
import Chart from 'chart.js';
// react plugin used to create charts
import { Line, Bar } from 'react-chartjs-2';
// reactstrap components
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
let chartExample1 = {
  options: {
    scales: {
      yAxes: [
        {
          gridLines: {
            color: colors.gray[900],
            zeroLineColor: colors.gray[900],
          },
          ticks: {
            callback: function (value) {
              if (!(value % 10)) {
                return 'Rs. ' + value + 'k';
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

          content += 'Rs. ' + yLabel + 'k';
          return content;
        },
      },
    },
  },
  data1: (canvas) => {
    return {
      labels: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',],
      datasets: [
        {
          label: 'Performance',
          data: [0, 20, 40, 30, 15, 40, 20, 60, 60, 90, 140],
        },
      ],
    };
  },
  data2: (canvas) => {
    return {
      labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Performance',
          data: [0, 20, 5, 25, 10, 30, 15, 40, 40],
        },
      ],
    };
  },
};
class DashboardPage extends React.Component {
  names = ['Priyav', 'Harsh', 'Rahul', 'Rishi', 'Vrutik'];
  //   userid = localStorage.getItem('userid');
  //   token = localStorage.getItem('Authorization');
  // profileName = this.props.location.state.name
  chartExample1 = {
    options: {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: colors.gray[900],
              zeroLineColor: colors.gray[900],
            },
            ticks: {
              callback: function (value) {
                if (!(value % 10)) {
                  return 'Rs. ' + value + 'k';
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

            content += 'Rs. ' + yLabel + 'k';
            return content;
          },
        },
      },
    },
    data1: (canvas) => {
      return {
        labels: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',],
        datasets: [
          {
            label: 'Performance',
            //data: [0, 20, 40, 30, 15, 200, 20, 60, 60, 90, 160, 100],
            data : this.state.incomeGraph
          },
        ],
      };
    },
    data2: (canvas) => {
      return {
        labels: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',],
        datasets: [
          {
            label: 'Performance',
            data: [0, 20, 5, 25, 10, 30, 15, 40, 40],
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
      income: true,
      loading: false,
      data: {},
      expenses: [],
      showMore: false,
      profileName: '',
      incomeData: {
        labels: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',],
        datasets: [
          {
            label: 'Performance',
            data: [0, 20, 40, 30, 15, 200, 20, 60, 60, 90, 160, 100],
          },
        ],
      },
      expenseData: {
        labels: ['Jan','Feb','March','April','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec',],
        datasets: [
          {
            label: 'Performance',
            data: [0, 40, 100, 80, 90, 50, 200],
          },
        ],
      },

      expenseGraph : [],
      incomeGraph : []
    };
    if (window.Chart) {
      parseOptions(Chart, chartOptions());
    }
  }

  async componentDidMount() {
    this.setState({ ...this.state, loading: true });
    const res = await axios
      .get(
        `https://cors-anywhere.herokuapp.com/https://rpk-expense-tracker.herokuapp.com/dashboard/${sessionStorage.getItem(
          'userid'
        )}`,
        { headers: { Authorization: sessionStorage.getItem('Authorization') } }

      )
      .then((res) => {
        console.log(res);
        this.setState({
          ...this.state,
          loading: false,
          data: res.data,
          expenses: res.data.transactions,
          profileName: res.data.name,
          expenseGraph : res.data.expensedf,
          incomeGraph: res.data.incomedf
        });
      });
  }
  toggleNavs = (e, index) => {
    e.preventDefault();

    this.setState({
      ...this.state,
      activeNav: index,
      // chartExample1Data:
      //   this.state.chartExample1Data === 'data1' ? 'data2' : 'data1',
      chartExample1Data:
         index === 1 ? 'data1' : 'data2',
      income: index === 1 ? true : false,
    });

    console.log(this.state.income);
  };
  graphData(income) {
    if (income) {
      return this.incomeData;
    } else return this.expenseData;
  }
  render() {
    console.log(chartExample1.data1);
    console.log(this.state.expenseGraph);
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
                        <h2 className='text-white mb-0'>
                          Transaction Analysis
                        </h2>
                      </div>
                      <div className='col'>
                        <Nav className='justify-content-end' pills>
                          <NavItem>
                            <NavLink
                              className={classnames('py-2 px-3', {
                                active: this.state.activeNav === 1,
                              })}
                              href='#pablo'
                              onClick={(e) => this.toggleNavs(e, 1)}
                            >
                              <span className='d-none d-md-block'>Income</span>
                              <span className='d-md-none'>M</span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames('py-2 px-3', {
                                active: this.state.activeNav === 2,
                              })}
                              data-toggle='tab'
                              href='#pablo'
                              onClick={(e) => this.toggleNavs(e, 2)}
                            >
                              <span className='d-none d-md-block'>Expense</span>
                              <span className='d-md-none'>W</span>
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className='chart'>
                      <Line
                        //data={this.graphData(this.state.income)}
                        data={chartExample1[this.state.chartExample1Data]}
                        options={chartExample1.options}
                        // getDatasetAtEvent={e => console.log(e)}
                      />
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col className='mb-5 mb-xl-0' xl='4'>
                <Card className='bg-gradient-default shadow'>
                  <CardHeader className='bg-transparent'>
                    <Row className='align-items-center'>
                      <div className='col'>
                        <h6 className='text-uppercase text-light ls-1 mb-1'>
                          Overview
                        </h6>
                        <h2 className='text-white mb-0'>
                          Transaction Analysis
                        </h2>
                      </div>
                      <div className='col'>
                        <Nav className='justify-content-end' pills>
                          <NavItem>
                            <NavLink
                              className={classnames('py-2 px-3', {
                                active: this.state.activeNav === 1,
                              })}
                              href='#pablo'
                              onClick={(e) => this.toggleNavs(e, 1)}
                            >
                              <span className='d-none d-md-block'>Income</span>
                              <span className='d-md-none'>M</span>
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames('py-2 px-3', {
                                active: this.state.activeNav === 2,
                              })}
                              data-toggle='tab'
                              href='#pablo'
                              onClick={(e) => this.toggleNavs(e, 2)}
                            >
                              <span className='d-none d-md-block'>Expense</span>
                              <span className='d-md-none'>W</span>
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* Chart */}
                    <div className='chart'>
                      <Line
                        data={
                          this.state.income
                            ? this.state.incomeData
                            : this.state.expenseData
                        }
                        //data={chartExample1[this.state.chartExample1Data]}
                        options={chartExample1.options}
                        // getDatasetAtEvent={e => console.log(e)}
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
                        {/* <h6 className="text-uppercase text-muted ls-1 mb-1">
                        Performance
                      </h6> */}
                        {this.state.isIncome == true ? (
                          <h2 className='mb-0'>Add Income</h2>
                        ) : (
                          <h2 className='mb-0'>Add Expense</h2>
                        )}
                      </div>
                    </Row>
                  </CardHeader>
                  <CardBody>
                    {/* <div className="chart">
                      <Bar
                        data={chartExample2.data}
                        options={chartExample2.options}
                      />
                    </div> */}
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
                          autoComplete='new-email'
                          onChange={(e) => console.log(e.target.value)}
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
                          autoComplete='new-password'
                        />
                      </InputGroup>
                    </FormGroup>
                    <Row>
                      {/* <div className='ml-3'>
                            <FormGroup check>
                              <Label check>
                                <Input type="radio" name="radio1" value="Income" onChange={(e) => console.log(e.target.value)} />{' '}
                            Income
                              </Label>
                                </FormGroup>
                              </div>
                              <div className='ml-2'>
                                <FormGroup check>
                                  <Label check>
                                    <Input type="radio" name="radio1" value="Expense" onChange={(e) => console.log(e.target.value)} />{' '}
                                Expense
                              </Label>
                            </FormGroup>
                          </div> */}
                                            <div class="custom-control custom-control-alternative custom-radio mb-3 ml-3">
                                                <input name="custom-radio-2" class="custom-control-input" id="customRadio5" value="Income" type="radio" defaultChecked onChange={(e) => {
                                                    this.setState({ ...this.state, isIncome: true })
                                                    console.log(e.target.value)
                                                }} />
                                                <label class="custom-control-label" for="customRadio5">Income</label>
                                            </div>
                                            <div class="custom-control custom-control-alternative custom-radio ml-3">
                                                <input name="custom-radio-2" class="custom-control-input" id="customRadio6" value="Expense" type="radio" onChange={(e) => {
                                                    this.setState({ ...this.state, isIncome: false })
                                                    console.log(e.target.value)
                                                }} />
                                                <label class="custom-control-label" for="customRadio6">Expense</label>
                                            </div>
                                        </Row>
                                        <div class="form-group">
                                            <div class="input-group input-group-alternative">
                                                <div class="input-group-prepend">
                                                    <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                                                </div>
                                                <input class="form-control text datepicker" placeholder="date placeholder" type="date" name="date" onChange = {(e) => {
                                                  var date = e.target.value
                                                  console.log(date);
                                                  var day = date.split("-")[0]
                                                  var month = date.split("-")[1]
                                                  var year = date.split("-")[2]
                                                  console.log(day + " " + month + " " + year);
                                                }}/>
                                            </div>
                                        </div>
                                        {this.state.isIncome == true ? (<button class="btn btn-block btn-success">Add Income</button>) : (<button class="btn btn-block btn-danger">Add Expense</button>)}
                                    </CardBody>
                                </Card>
                            </Col >
                        </Row >
                        <Row className="mt-5">
                            <Col className="mb-5 mb-xl-0" xl="12">
                                <Card className="shadow">
                                    <CardHeader className="border-0">
                                        <Row className="align-items-center">
                                            <div className="col">
                                                <h3 className="mb-0">Your Transactions</h3>
                                            </div>
                                            <div className="col text-right">
                                                <Button
                                                    color="primary"
                                                    href="#pablo"
                                                    onClick={e => {
                                                      this.setState({
                                                        ...this.state,
                                                        showMore : !this.state.showMore
                                                      })
                                                    }}
                                                    size="sm"
                                                >
                                                    {this.state.showMore ? "Show Less" : "Show More"}
                                                </Button>
                                            </div>
                                        </Row>
                                    </CardHeader>
                                    <Table className="align-items-center table-flush" responsive>
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col">Type</th>
                                                <th scope="col">Description</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { 
                                              this.state.expenses && this.state.showMore ? this.state.expenses.map(expense => (
                                                <tr>
                                                    {
                                                      expense.type == "Income" ? (<th scope="row" style={{ color: "green"}}>{expense.type}</th>)
                                                      : <th scope="row" style={{ color: "red"}}>{expense.type}</th>
                                                    }
                                                    <td>{expense.description}</td>
                                                    <td>{expense.day} / {expense.month} / {expense.year}</td>
                                                    <td>
                                                      {
                                                        expense.type == "Income" ? (<i className="fas fa-arrow-up text-success mr-3" />)
                                                        : (<i className="fas fa-arrow-down text-warning mr-3" />)
                                                      }
                                                      {" "}
                                                      {expense.amount}
                                                    </td>
                                                </tr>
                                              )
                                              ) : 
                                              this.state.expenses && (this.state.expenses.slice(0,5).map(expense => (
                                                <tr>
                                                    {
                                                      expense.type == "Income" ? (<th scope="row" style={{ color: "green"}}>{expense.type}</th>)
                                                      : <th scope="row" style={{ color: "red"}}>{expense.type}</th>
                                                    }
                                                    <td>{expense.description}</td>
                                                    <td>{expense.day} / {expense.month} / {expense.year}</td>
                                                    <td>
                                                      {
                                                        expense.type == "Income" ? (<i className="fas fa-arrow-up text-success mr-3" />)
                                                        : (<i className="fas fa-arrow-down text-warning mr-3" />)
                                                      }
                                                      {" "}
                                                      {expense.amount}
                                                    </td>
                                                </tr>
                                              )
                                              )
                                              )
                                            }
                                            {/* <tr>
                      <th scope="row">{this.names[0]}</th>
                      <td>4,569</td>
                      <td>340</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/index.html</th>
                      <td>3,985</td>
                      <td>319</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        46,53%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/charts.html</th>
                      <td>3,513</td>
                      <td>294</td>
                      <td>
                        <i className="fas fa-arrow-down text-warning mr-3" />{" "}
                        36,49%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/tables.html</th>
                      <td>2,050</td>
                      <td>147</td>
                      <td>
                        <i className="fas fa-arrow-up text-success mr-3" />{" "}
                        50,87%
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">/argon/profile.html</th>
                      <td>1,795</td>
                      <td>190</td>
                      <td>
                        <i className="fas fa-arrow-down text-danger mr-3" />{" "}
                        46,53%
                      </td>
                    </tr> */}
                    </tbody>
                  </Table>
                </Card>
              </Col>
              {/* <Col xl="4">
              <Card className="shadow">
                <CardHeader className="border-0">
                  <Row className="align-items-center">
                    <div className="col">
                      <h3 className="mb-0">Social traffic</h3>
                    </div>
                    <div className="col text-right">
                      <Button
                        color="primary"
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                        size="sm"
                      >
                        See all
                      </Button>
                    </div>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Referral</th>
                      <th scope="col">Visitors</th>
                      <th scope="col" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>1,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">60%</span>
                          <div>
                            <Progress
                              max="100"
                              value="60"
                              barClassName="bg-gradient-danger"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Facebook</th>
                      <td>5,480</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">70%</span>
                          <div>
                            <Progress
                              max="100"
                              value="70"
                              barClassName="bg-gradient-success"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Google</th>
                      <td>4,807</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">80%</span>
                          <div>
                            <Progress max="100" value="80" />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Instagram</th>
                      <td>3,678</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">75%</span>
                          <div>
                            <Progress
                              max="100"
                              value="75"
                              barClassName="bg-gradient-info"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">twitter</th>
                      <td>2,645</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="mr-2">30%</span>
                          <div>
                            <Progress
                              max="100"
                              value="30"
                              barClassName="bg-gradient-warning"
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col> */}
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
