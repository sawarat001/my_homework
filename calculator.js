const SMALLEST_UNIT = 'penny';
            const MULTI_PENNY = 'pennies';
            class USCalculator {
                /**
                 * Constructor
                */
                constructor() {
                    this.usUnit = {
                        '100_dollar': [100, 0, '100 dollar bill'],
                        '50_dollar': [50, 0, '50 dollar bill'],
                        '20_dollar': [20, 0, '20 dollar bill'],
                        '10_dollar': [10, 0, '10 dollar bill'],
                        '5_dollar': [5, 0, '5 dollar bill'],
                        '1_dollar': [1, 0, '1 dollar bill'],
                        'quater': [0.25, 0, 'quarter'],
                        'dime': [0.1, 0, 'dime'],
                        'nickel': [0.05, 0, 'nickey'],
                        'penny': [0.01, 0, 'penny']
                    };
                    this.currentUnit = '100_dollar';
                    this.changeSummary = '';
                    this.returnResult = [];
                }

                /**
                 * Get latest result of US Money
                 */
                getUSMoney() {

                    var summary = [];
                    var totalResult = 0;
                    for (var key in this.usUnit) {
                        var monkeyValue = this.usUnit[key][0];
                        var total = this.usUnit[key][1];
                        var moneyLabel = this.usUnit[key][2];
                        var totalLabel = '';
                        
                        if (total > 0) {
                            if (total > 1) {
                                if(monkeyValue == 0.01) {
                                    totalLabel += total + ' ' + MULTI_PENNY;
                                } else {
                                    totalLabel += total + ' ' + moneyLabel + 's';
                                }
                            } else {
                                totalLabel += total + ' ' + moneyLabel;
                            }
                            summary.push(totalLabel);
                            totalResult = totalResult + (monkeyValue * total);
                        }
                    }

                    this.changeSummary = summary.join(' ,');
                    this.returnResult.push("Your change is  " + this.changeSummary);
                    //Format total result value
                    totalResult = Math.round(totalResult * 100) / 100;
                    this.returnResult.push(totalResult);
                    return this.returnResult;
                }

                /**
                * Count total number of current unit.
                * @param {p_value} current unit's value
                */
                countCurrentUnitTotal(p_value) {
                    this.usUnit[this.currentUnit][1] = p_value + 1;
                }

                /**
                 * Method to veriy the input is exactly number.
                 * @param {p_input} input number
                */
                isNumber(p_input) {
                    return !isNaN(parseFloat(p_input)) && isFinite(p_input);
                }
                
                /**
                * Method to change input number to US money.
                * @param {input} Input number that will be changed to US money.
                */
                changeNumberToUSMoney(input) {
                    if (!this.isNumber(input)) {
                        $('#sp_errorMessage').text('Invalid input format.');
                        return;
                    }
    
                    input = Math.round(input * 100) / 100;
                    var currentUnitValue = this.usUnit[this.currentUnit][0];
                    if (input >= currentUnitValue) {
                        var subTotal = (input - currentUnitValue) >= 0 ? (input - currentUnitValue) : input;
                        this.countCurrentUnitTotal(this.usUnit[this.currentUnit][1]);
                        return this.changeNumberToUSMoney(subTotal);
                    } else {
                        if (this.currentUnit != SMALLEST_UNIT) {
                            var currentUnitIndex = Object.keys(this.usUnit).indexOf(this.currentUnit);
                            this.currentUnit = Object.keys(this.usUnit)[currentUnitIndex + 1];
                            return this.changeNumberToUSMoney(input);
                        }
                    }

                    return this.getUSMoney();
                }

                /**
                * Unit test method
                * @param {int, int} input and expected result
                */
                testChangeNumberToUSMoney(input, expected) {
                    var result = this.changeNumberToUSMoney(input);
                    input = Math.round(input * 100) / 100;
                    expected = Math.round(expected * 100) / 100;
                    if (result && result.length > 0) {
                        return result[1] == expected ? true : false;
                    }

                    return false;
                }
            }

            $(function () {
                
                $('#bt_calculate').click( function () {
                    $('#sp_errorMessage').text('');
                    var input = $('#tx_input').val();
                    if (input) {
                        //Begin change input to US money
                        var calculator = new USCalculator();
                        var result = calculator.changeNumberToUSMoney(input);
                        $('#sp_result').text(result[0]);
                    } else {
                        alert('Please enter your input.');
                    }
                });

                $('#bt_unitTest').click( function (e) {
                    e.preventDefault();
                    $('#sp_errorMessage').text('');
                    var calculator = new USCalculator();
                    var input = $('#tx_input').val();
                    var resultMessage = '';
                    var testResult = calculator.testChangeNumberToUSMoney(input, input) ? 'passed' : 'failed';

                    resultMessage += 'Test data = ' + input + ' is ' + testResult;
                    $('#sp_result').text(resultMessage);
                });

                $('#bt_clear').click( function (e) {
                    e.preventDefault();
                    $('#tx_input').val('');
                    $('#sp_errorMessage').text('');
                    $('#sp_result').text('');
                });

                $('#tx_input').keyup( function (e) {
                    if(e.keyCode === 13) {
                        $('#bt_calculate').click();
                    }
                })
            });