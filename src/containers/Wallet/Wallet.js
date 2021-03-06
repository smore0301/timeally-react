import React, { Component } from 'react';
import { connect } from 'react-redux';
import copy from 'copy-to-clipboard';

const ethers = require('ethers');

class WalletPage extends Component {
  state = {
    userAddress: '',
    esBalance: {},
    etherBalance: {},
    totalStakingsNow: {},
    totalStakingsNext: {},
    shareNow: {},
    shareNext: {},
    myActiveStakings: undefined,
    copied: false
  };

  componentDidMount = async () => {
    if(Object.keys(this.props.store.walletInstance).length) {
      const currentMonth = await this.props.store.timeallyInstance.functions.getCurrentMonth();

      await this.setState({
        userAddress: this.props.store.walletInstance.address
      });

      (async()=>{
        this.setState({
          esBalance: await this.props.store.esInstance.functions.balanceOf(this.state.userAddress)
        });
      })();

      (async()=>{
        this.setState({
          etherBalance: await this.props.store.providerInstance.getBalance(this.state.userAddress)
        });
      })();

      (async() => {
        // const myActiveStakings = await this.props.store.timeallyInstance.functions.userActiveStakingByMonth(this.props.store.walletInstance.address, currentMonth);

        const numberOfStakings = Number(await this.props.store.timeallyInstance.functions
          .getNumberOfStakingsByUser(this.props.store.walletInstance.address));
        console.log('numberOfStakings',numberOfStakings);
        let myActiveStakings = ethers.utils.bigNumberify(0);
        if(numberOfStakings) {
          for(let stakingId = 0; stakingId < numberOfStakings; stakingId++) {
            // if(await this.props.store.timeallyInstance.functions.isStakingActive(
            //   this.props.store.walletInstance.address,
            //   stakingId,
            //   currentMonth
            // )) {
              const staking = await this.props.store.timeallyInstance.functions.stakings(
                this.props.store.walletInstance.address,
                stakingId
              );
              if(Number(staking[4]) === 1) {
                myActiveStakings = myActiveStakings.add(staking[0]);
              }

              // console.log(ethers.utils.formatEther(staking[0]))
            // }
          }
        }

        this.setState({ myActiveStakings: ethers.utils.formatEther(myActiveStakings) });
      })();
    }
  }

  render() {
    let isWalletPresent = false;
    if(Object.keys(this.props.store.walletInstance).length) {
      isWalletPresent = true;
    }
    return (
      <div>
            <div className="page-header">
              <div className="container">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="page-breadcrumb">
                      <ol className="breadcrumb">
                        <li><a>Home</a></li>
                        <li className="active">Wallet</li>
                      </ol>
                    </div>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="bg-white pinside30">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-9 col-sm-12 col-12">
                          <h1 className="page-title">Wallet</h1>
                        </div>
                        {/* <div className="col-xl-8 col-lg-8 col-md-3 col-sm-12 col-12">
                          <div className="row">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                              <div className="btn-action"> <a href="#" className="btn btn-default">How To Apply</a> </div>
                            </div>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* content start */}
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="wrapper-content bg-white pinside40">
                   <div className="bg-white section-space80">
                     <div className="container">
                  <div className="row">
                    {
                     isWalletPresent ?
                    <div className="col-12">
                      <div className="bg-white pinside30 mb30 highlight-outline outline set-word-break-all">
                        <p><b>YourAddress</b> : <span style={{color:'#f51f8a'}} onClick={() => {
                          copy(this.state.userAddress);
                          this.setState({ copied: true });
                          setTimeout(this.setState.bind(this, {copied: false}), 2000);
                        }}>{this.state.userAddress}</span>{this.state.copied ? <>✓ Copied!</> : null}</p>
                        <div className="row">
                          <div className="col-md-6 set-word-break-all"><b>Your ES Balance</b>:
                            {Object.keys(this.state.esBalance).length ? ethers.utils.formatEther(this.state.esBalance) : null} ES</div>
                          <div className="col-md-6 set-word-break-all"><b>Your Ether Balance</b>:
                            {Object.keys(this.state.etherBalance).length ? ethers.utils.formatEther(this.state.etherBalance) : null } ETH</div>
                          <div className="col-md-6 set-word-break-all"><b>Your Stakings</b>:
                            {this.state.myActiveStakings ? this.state.myActiveStakings + ' ES' : 'Loading...'}</div>



                        </div>
                      </div>
                    </div>
                    : <p onClick={() => this.props.history.push('/load-wallet')}>Please load your wallet</p>
                  }


                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => {return{store: state}})(WalletPage);
