import React, {useState} from 'react'
import axios from 'axios';
import ENS from 'ethereum-ens';
// Redux Hook
import {useDispatch, useMappedState} from 'redux-react-hook';

import OtocoRegistrar from '../../SmartContracts/OtocoRegistrar'
import Address from '../../UIComponents/Address'

import Button from 'semantic-ui-react/dist/commonjs/elements/Button'
import Transaction from '../../UIComponents/Transaction';

export default () => {

    const dispatch = useDispatch();
    const {manageSeries, manageEns, ensOptions} = useMappedState(({managementState}) => managementState);
    const {currentAccount, network} = useMappedState(({accountState}) => accountState);
    const [transaction, setTransaction] = useState(null);
    const [success, setSuccess] = useState(false);

    const ens = new ENS(web3.currentProvider);

    const handlerClickSend = async (e) => {
        let requestInfo = {from: currentAccount, gas:200000};
        try {
            const gasFees = await axios.get(`https://ethgasstation.info/api/ethgasAPI.json`);
            requestInfo.gasPrice = web3.utils.toWei((gasFees.data.fast*0.1).toString(), 'gwei');
        } catch (err){
            console.log('Could not fetch gas fee for transaction.');
        }
        console.log(network, requestInfo)
        try {
            OtocoRegistrar.getContract(network).methods.registerAndStore(
                manageEns.name,
                manageSeries.contract
            ).send(requestInfo, (error, hash) => {
                setTransaction(hash);
            })
        } catch (err) {
            console.log(err);
        }
    }

    const registeringFinished = async (e) => {
        setTransaction(null);
        setSuccess(true);
    }

    const handlerClickBack = async (e) => {
        dispatch({type:'Set ENS Name', name: ''})
        dispatch({type:'Set ENS Step', step: 0})
    }

    return (
        <div>
            <h4 style={{paddingTop: '30px'}}>
                {manageEns.name}.{manageEns.selectedDomain} will be registered on behalf of the Copyrights manager <Address address={currentAccount}></Address>
                , and the domain will point to the CopyrightID's contract address <Address address={manageSeries.contract}></Address>
            </h4>
            {transaction && <Transaction hash={transaction} title="Register Subdomain" callback={registeringFinished}></Transaction>}
            {!transaction && !success && <Button id="btn-check-nmae" className="primary" type="submit" onClick={handlerClickSend}>Send Request</Button>}
            {success && <p>Your domain "alias" was successfully registered! Click 'back' and verify the domain.</p>}
            {success && 
                <Button id="btn-check-nmae" className="primary" type="submit" onClick={handlerClickBack}>Back to Verification</Button>
            }
        </div>
    )

}
