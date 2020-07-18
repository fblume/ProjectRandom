var web3 = new Web3(Web3.givenProvider);
var contractInstance;
var customerAddress;
var totalGain = 0;
var totalCost = 0;
var lastN = 0;
var owner = false;

  $(document).ready(function(){
    window.ethereum.enable().then(function(accounts){
      contractInstance = new web3.eth.Contract(abi, "0x5d875597BC60178469f6580D4305E0F2a038149B", {from: accounts[0]});
      console.log(contractInstance);
      customerAddress = accounts[0];
      contractInstance.methods.verifyOwner().call({from: customerAddress}).then(function(ownerTest){
        if(ownerTest){
          $("#withdraw_all_button").removeAttr("style");
        }
      });
      $("#submit_and_play_button").click(submitAndPlay);
      $("#withdraw_total_gain").click(withdrawTotalGain);
      $("#withdraw_all").click(withdrawAll);

        function submitAndPlay(){
          var potentialGainLoss = 0;
          var onZero = 0;
          var onOne = 0;
          var totalCount = 0;
          var netBalance;
          var moreOnZero = false;
          $("#gain_output").text(" ");
          $("#cost_output").text(" ");
          ctx.font = "45px Arial";
          setColor(lastN);
          ctx.fillText(lastN % 2,62+lastN*50,91);
          onZero = $("#on_zero_input").val();
          onOne = $("#on_one_input").val();
          if(onZero>=onOne){
            moreOnZero = true;
          }
          potentialGainLoss = Math.round(1000000*Math.abs(onZero - onOne))/1000000;
          console.log("potential gain: " + web3.utils.toWei(potentialGainLoss.toString(), "ether") + " " + potentialGainLoss);
          contractInstance.methods.getNetContractBalance().call().then(function(netBalance){
            if(1*netBalance > 1*web3.utils.toWei(potentialGainLoss.toString(), "ether")){
              var config = {from: customerAddress, value: web3.utils.toWei(potentialGainLoss.toString(), "ether")};
              contractInstance.methods.receiveBet(moreOnZero).send(config).then(function(){
                contractInstance.methods.getRandomValue().call({from: customerAddress})
                .then(function(randomValue){
                  numberAnimation(randomValue);
                });
              });
            }else{
              alert("Your bet is too large!");
            }
          });

          function setColor(m){
            if(m % 2 == 0){
              ctx.fillStyle = "black";
            }else{
              ctx.fillStyle = "white";
            }
          }

          function numberAnimation(randomValue){
            var count = 0;
            var n = 0;
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
                gainOrLoss();
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
          }

          function gainOrLoss(){
            var gain = Math.round(2000000*(onOne - onZero)*(2*(totalCount % 2) - 1))/1000000;
            var netGain;
            totalCost += potentialGainLoss;
            if(gain>0){
              totalGain += gain;
            }
            netGain = Math.round(1000000*(totalGain - totalCost))/1000000;
            $("#total_cost_output").text(totalCost + " ether");
            $("#total_gain_output").text(totalGain + " ether");
            if(netGain<0){
              $("#net_gain_output").attr("style",  "color:red");
            }else{
              if(netGain>0){
                $("#net_gain_output").attr("style",  "color:green");
              }else{
                $("#net_gain_output").attr("style",  "color:black");
              }
            }
            $("#net_gain_output").text(netGain + " ether");
            $("#cost_output").text(potentialGainLoss + " ether");
            if(gain<0){
              $("#gain_output").text("0 ether");
            }else{
              $("#gain_output").text(gain + " ether");
            }
            $("#submit_and_play_button").html("Submit and Play Again");
          }
        }

        function withdrawTotalGain(){
          totalCost = 0;
          totalGain = 0;
          $("#total_cost_output").text("0 ether");
          $("#total_gain_output").text("0 ether");
          $("#net_gain_output").attr("style",  "color:black");
          $("#net_gain_output").text("0 ether");
          $("#gain_output").text(" ");
          $("#cost_output").text(" ");
          contractInstance.methods.payCustomer().send({from: customerAddress}).then(function(){
            alert("Withdrawl complete!");
          });
        }
        function withdrawAll(){
          contractInstance.methods.withdrawAll().send({from: customerAddress}).then(function(){
            alert("Withdrawl complete!");
          });
        }
      });
    });
