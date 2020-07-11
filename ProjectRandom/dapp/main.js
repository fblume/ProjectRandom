var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var lastN = 0;
var potentialGainLoss = 0;
var encoding = "RETEEssdf34fgdcccvv565(some random string)";

var owner = "0x30c2beE07179b5ef41fcd1017eDc734b2983E26B";

  $(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x872be5C771228602b787515e04D3AF1ADDBD1C2e", {from: accounts[0]});
        console.log(contractInstance);
        ctx.font = "45px Arial";
        $("#submit_and_play_button").click(submitAndPlay);
        function submitAndPlay(){
          var onZero = 0;
          var onOne = 0;
          var totalCount = 0;
          var customerAddress = $("#account_input").val();

          function setColor(m){
            if(m % 2 == 0){
              ctx.fillStyle = "black";
            }else{
              ctx.fillStyle = "white";
            }
          }

          if(customerAddress.length == 42){
            setColor(lastN);
            ctx.fillText(lastN % 2,62+lastN*50,91);
            onZero = $("#on_zero_input").val();
            onOne = $("#on_one_input").val();
            potentialGainLoss = web3.utils.toWei(Math.abs(onZero - onOne).toString(), "ether");
            contractInstance.methods.getBalance().call().then(function(contractBalance){
              if(1*contractBalance > 1*potentialGainLoss){
                var config = {from: customerAddress, value: potentialGainLoss};
                contractInstance.methods.receiveMoney().send(config).then(function(){
                  var date = new Date();
                  var count = 0;
                  var n = 0;
                  contractInstance.methods.random(web3.utils.fromAscii(date + encoding)).call({from: owner})
                  .then(function(randomValue){
                    totalCount = 18  + 1*randomValue;
                    ctx.fillStyle = "red";
                    ctx.fillText(0,62,91);
                    var id = setInterval(runNumbers,200);
                    function runNumbers() {
                      if(Math.floor(count/9) % 2 == 0){
                        n++;
                      }else{
                        n--;
                      }
                      if(count == totalCount){
                        clearInterval(id);
                      }else{
                        setColor(n-1);
                        if(Math.floor(count/9) % 2 == 0){
                          ctx.fillText((n-1) % 2,62+(n-1)*50,91);
                        }else{
                          ctx.fillText((n+1) % 2,62+(n+1)*50,91);
                        }
                        ctx.fillStyle = "red";
                        ctx.fillText(n % 2,62+n*50,91);
                        lastN = n;
                        count++;
                      }
                    }
                  }).then(function(){
                    var gain = (onOne - onZero)*(2*(totalCount % 2) - 1);
                    if(gain<0){
                      $("#gain_output").text("0 ether");
                      $("#loss_output").text(Math.abs(gain) + " ether");
                    }else{
                      $("#loss_output").text("0 ether");
                      $("#gain_output").text(gain + " ether");
                      gain = Math.round(2000000*gain);
                    contractInstance.methods.sendMoney(customerAddress, gain).call({from: owner}).then(function(transferAmount){
                      console.log(transferAmount);
                    });
                    }
                  });
                });
              }else{
                alert("Your bet is too large!");
              }
            });
          }else{
            alert("Invalid Address!");
          }
        }
      });
    });
