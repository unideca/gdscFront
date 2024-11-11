// Cordova가 아닌 브라우저 환경에서 onDeviceReady 호출
if (typeof cordova === "undefined") {
  document.addEventListener("DOMContentLoaded", onDeviceReady);
} else {
  document.addEventListener("deviceready", onDeviceReady, false);
}

// 기존 android만 되던 코드
// document.addEventListener("deviceready", onDeviceReady, false); 2-6까지가 1줄 이었음

/* import */
// starting
var serverURL = "https://gdscs-6d0624e4b843.herokuapp.com";

function onDeviceReady() {


  document.addEventListener("backbutton", onBackKeyDown, true);

  // Fingerprint.show({
  //   disableBackup : false,
  //   // description: "Some biometric description"
  // }, successCallback, errorCallback);

  // function successCallback(){
  //   alert("Authentication successful");
  // }

  // function errorCallback(error){
  //   alert("Authentication invalid " + error.message);
  // }

  //여기부터

  if (window.FirebasePlugin) {
    // Retrieve the Firebase token if available
    window.FirebasePlugin.getToken(function (token) {
      console.log("Firebase Token:", token);
    }, function (error) {
      console.error("Error getting token:", error);
    });

    // Set up onMessageReceived if available
    window.FirebasePlugin.onMessageReceived(function (message) {
      console.log("Firebase message received:", message);
      cordova.plugins.notification.local.schedule({
        title: "My first notification",
        text: "Thats pretty easy...",
        foreground: true,
      });
    });
  } else {
    console.warn("FirebasePlugin is not available in this environment.");
  }

  //여기까지 추가한 코드 browser에서도 앱 볼 수 있게 하려고 
  //위에보면 FirebasePlugin이 없으면 warn만하고 넘어가게끔 코드 작성됨
  //기존에는 아래 62-70까지만 있었음 RirebasePlugin 없어서 browser환경에서 에러남
  testestestset();


  // window.FirebasePlugin.onMessageReceived(function (message) {
  //   console.log(message);
  //   cordova.plugins.notification.local.schedule({
  //     title: "My first notification",
  //     text: "Thats pretty easy...",
  //     foreground: true,
      
  //   });
  // });
  
  if (window.localStorage.getItem("AppfirstTime") == null) {
    console.log("최초 실행!");
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/infoPage1.html", function (data) {
        $(_this).append(data);
      });
    });

    window.localStorage.setItem("AppfirstTime", 1);
  } else {
    console.log("최초 실행이 아니다~~~!!");

    if (window.localStorage.getItem("userinfo") == null) {
      $(".changeSections").each(function () {
        var _this = this;
        $.get("./templates/loginPage.html", function (data) {
          $(_this).append(data);
        });
      });
    } else {
      // $('#loading1').show()
      var saveCheck = window.localStorage.getItem("saveID");
      saveCheck = JSON.parse(saveCheck);
      var autoLoginCheck = window.localStorage.getItem("autologin");
      autoLoginCheck = JSON.parse(autoLoginCheck);
      var user = window.localStorage.getItem("userinfo");
      userinfo = JSON.parse(user);
      // user = JSON.parse(user)
      // console.log("userinfo의 값은? ", userinfo)

      var loginEmail = userinfo.username;
      var loginPw = userinfo.password;

      if (autoLoginCheck.YN == "Y") {
        $.ajax({
          url: serverURL + "/userLoginDateUp/",
          type: "POST",
          data: { userID: loginEmail },
          dataType: "json",
          async: true,
          success: function (result) {
            var _user = JSON.parse(user);
            console.log("user.id", _user.id);
            if (
              _user.id == "1" ||
              _user.id == "2" ||
              _user.id == "5" ||
              _user.id == "6" ||
              _user.id == "7"
            ) {
              console.log("OTP PASS Email");
              MainFn();
            } else {
              window.localStorage.setItem(
                "userinfo",
                JSON.stringify(result.user)
              );
              userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
              $(".changeSections").each(function () {
                var _this = this;
                $.get("./templates/loginCheckOTP.html", function (data) {
                  $(_this).append(data);
                  $("#loading1").hide();
                  $(".loginPage").remove();
                });
              });
              // $('#splashArea').hide()
            }
          },
          error: function (error) {
            $("#loading1").hide();
            console.log(error);
          },
        });
      } else {
        // $('#loading1').hide()
        if (saveCheck.YN == "Y") {
          $(".changeSections").each(function () {
            var _this = this;
            $.get("./templates/loginPage.html", function (data) {
              $(_this).append(data);

              $("#loginEmail").val(loginEmail);
              var bbb = document.getElementById("saveID");
              bbb.checked = true;
              $("#bbb").addClass("on");
            });
          });
        } else {
          $(".changeSections").each(function () {
            var _this = this;
            $.get("./templates/loginPage.html", function (data) {
              $(_this).append(data);
            });
          });
        }
      }
    }
  }
}

// alertToast
function alertToast(msg) {
  window.plugins.toast.showWithOptions({
    message: msg,
    duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
    position: "bottom",
    addPixelsY: -40, // added a negative value to move it up a bit (default 0)
    styleing: {
      cornerRadius: 0, // 최소값은 0(정사각형)입니다. iOS 기본값 20, Android 기본값 100
    },
  });
}

// backBtn
function backButton(obj) {
  $(obj).parent().parent().remove();
  $(".camPop").remove();
  $(".solutionPop").remove();
  $(".savesolutionPop").remove();
  $(".logoutPop").remove();
  $(".resiliPop").remove();
}

function onBackKeyDown(e) {
  if ($(".cammnuPop1").css("display") == "block") {
    $(".cammnuPop1 .cammnuCont .btnArea>a").attr("onclick", "");
    $(".cammnuPop1").hide();
  } else if ($(".gdstsrchsetPop").css("display") == "block") {
    $(".gdstsrchsetPop .srchsetCont")
      .stop()
      .animate(
        {
          bottom: "-50%",
        },
        250,
        function () {
          $(".gdstsrchsetPop").hide();
          $("#ui-datepicker-div").hide();
        }
      );
  } else if ($("#layer").css("display") == "block") {
    $("#layer").hide();
  } else if ($(".vicsrchsetPop").css("display") == "block") {
    $(".vicsrchsetPop .srchsetCont")
      .stop()
      .animate(
        {
          bottom: "-50%",
        },
        250,
        function () {
          $(".vicsrchsetPop").hide();
        }
      );
  } else if ($(".ethsrchsetPop").css("display") == "block") {
    $(".ethsrchsetPop .srchsetCont")
      .stop()
      .animate(
        {
          bottom: "-50%",
        },
        250,
        function () {
          $(".ethsrchsetPop").hide();
          $("#ui-datepicker-div").hide();
        }
      );
  } else {
    if ($(".mainmnuPage").css("display") == "block") {
      $(".mainmnuPage .mainmnuCont")
        .stop()
        .animate(
          {
            right: "-62vw",
          },
          250,
          function () {
            $(".mainmnuPage").hide();
          }
        );
      $("#changeWriter").attr("onclick", "");
      $("#myWallet").attr("onclick", "");
      $("#inHistory").attr("onclick", "");
      $("#news").attr("onclick", "");
      $("#setting").attr("onclick", "");

      // } else if ($('.mainPage').css('display') == "block") {
      // onBackKeyDownout();
    } else {
      var len = $(".changeSections").children().length - 1;
      console.log("length::", len);

      if ($("#loading").css("display") == "block") {
      } else {
        if (len === 0) {
          if (new Date().getTime() - lastTimeBackPress < timePeriodToExit) {
            navigator.app.exitApp();
          } else {
            window.plugins.toast.showWithOptions({
              message: "뒤로가기 버튼을 한 번 더 누르시면 종료됩니다.",
              // message: "Click the back button once more to Exit.",
              duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
              position: "bottom",
              addPixelsY: -40, // added a negative value to move it up a bit (default 0)
            });
            lastTimeBackPress = new Date().getTime();
          }
        } else {
          $(".changeSections").children().eq(len).remove();
          //   if (len === 1) {
          //      if ($('.mainPage').css('display') == "block") {
          //      navigator.notification.confirm('로그아웃 하시겠습니까?', onBackKeyDownLogout, '로그아웃', '취소, 로그아웃');
          //   } else {
          //         $('.changeSections').children().eq(len).remove();
          //   }
          //  } else {
          //      $('.changeSections').children().eq(len).remove();
          //  }
        }
      }
    }
  }
}

/* ----------------------------------------------------------------------------- */

function emailCheck() {
  var email = $("#signUpEmail").val();
  var reg =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  if (reg.test(email) == false) {
    alertToast("이메일 양식을 확인해주십시오.");
  } else {
    $.ajax({
      url: serverURL + "/checkEmail/",
      type: "POST",
      data: { email: email },
      dataType: "json",
      async: true,
      success: function (result) {
        var val = result.value;
        if (val == "1") {
          console.log("기존 이메일 존재하기 때문에 사용할 수 없다.");

          var a1 = $("#checkemailoverlap").attr("class");
          if (a1 == "creapass") {
            $("#checkemailoverlap").addClass("err");
          } else if (a1 == "creapass on") {
            $("#checkemailoverlap").removeClass("on");
            $("#checkemailoverlap").addClass("err");
          }
          // --------------------------------------
          $(".nextBtn").removeClass("on");
          $("#signupnextBtn").attr("onclick", "");
          // --------------------------------------
        } else if (val == "0") {
          console.log("사용 가능한 이메일입니다.");

          var a1 = $("#checkemailoverlap").attr("class");
          if (a1 == "creapass") {
            $("#checkemailoverlap").addClass("on");
          } else if (a1 == "creapass err") {
            $("#checkemailoverlap").removeClass("err");
            $("#checkemailoverlap").addClass("on");
          }
          // --------------------------------------
          var signupClass1 = $("#signupCrepass").attr("class");
          var signupClass2 = $("#signupCrepass2").attr("class");
          if (signupClass1 == "creapass on" && signupClass2 == "creapass on") {
            $(".nextBtn").addClass("on");
            $("#signupnextBtn").attr("onclick", "checkQrhtml()");
          }
          // --------------------------------------
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
}

function emailCheck2() {
  var email = $("#signUpEmail").val();
  var reg =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  if (reg.test(email) == false) {
  } else {
    $.ajax({
      url: serverURL + "/checkEmail/",
      type: "POST",
      data: { email: email },
      dataType: "json",
      async: false,
      success: function (result) {
        var val = result.value;
        if (val == "1") {
          console.log(
            "emailCheck2 기존 이메일 존재하기 때문에 사용할 수 없다."
          );

          var a1 = $("#checkemailoverlap").attr("class");
          if (a1 == "creapass") {
            $("#checkemailoverlap").addClass("err");
          } else if (a1 == "creapass on") {
            $("#checkemailoverlap").removeClass("on");
            $("#checkemailoverlap").addClass("err");
          }
          // --------------------------------------
          $(".nextBtn").removeClass("on");
          $("#signupnextBtn").attr("onclick", "");
          // --------------------------------------
        } else if (val == "0") {
          console.log("emailCheck2 사용 가능한 이메일입니다.");

          var a1 = $("#checkemailoverlap").attr("class");

          if (a1 == "creapass") {
            $("#checkemailoverlap").addClass("on");
          } else if (a1 == "creapass err") {
            $("#checkemailoverlap").removeClass("err");
            $("#checkemailoverlap").addClass("on");
          }
          // --------------------------------------
          var signupClass1 = $("#signupCrepass").attr("class");
          var signupClass2 = $("#signupCrepass2").attr("class");
          if (signupClass1 == "creapass on" && signupClass2 == "creapass on") {
            $(".nextBtn").addClass("on");
            $("#signupnextBtn").attr("onclick", "checkQrhtml()");
          }
          // --------------------------------------
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
}

function idCheck() {
  var email = $("#email").val();

  $.ajax({
    url: serverURL + "/checkEmail/",
    type: "POST",
    data: { email: email },
    dataType: "json",
    async: true,
    success: function (result) {
      var val = result.value;

      if (val == 1) {
        console.log("회원 정보가 존재, 비번 변경 가능");
        $("#confEmailerron").removeClass("err");
        $("#confEmailerron").addClass("on");
        $("#psnextOn").addClass("on");

        $("#confEmailnext").attr("disabled", false);
        $("#confEmailnext").attr("onclick", "newPassword()");
      } else {
        console.log("회원 정보가 없다. 비번 변경 불가");
        $("#confEmailerron").addClass("err");
        $("#confEmailerron").removeClass("on");
        $("#psnextOn").removeClass("on");

        $("#confEmailnext").attr("disabled", true);
        $("#confEmailnext").attr("onclick", "");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function idCheck2() {
  var email = $("#email").val();
  $.ajax({
    url: serverURL + "/checkEmail/",
    type: "POST",
    data: { email: email },
    dataType: "json",
    async: true,
    success: function (result) {
      var val = result.value;

      if (val == 1) {
        console.log("idCheck2 회원 정보가 존재, 비번 변경 가능");
        $("#confEmailerron").removeClass("err");
        $("#confEmailerron").addClass("on");
        $("#psnextOn").addClass("on");

        $("#confEmailnext").attr("disabled", false);
        $("#confEmailnext").attr("onclick", "newPassword()");
      } else {
        console.log("idCheck2 회원 정보가 없다. 비번 변경 불가");
        $("#confEmailerron").addClass("err");
        $("#confEmailerron").removeClass("on");
        $("#psnextOn").removeClass("on");

        $("#confEmailnext").attr("disabled", true);
        $("#confEmailnext").attr("onclick", "");
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

// function certify() {
//   // $('.termsagreePage').remove()
//   console.log("certify 실행됨");
//   identificationFindId = cordova.InAppBrowser.open(
//     "http://arte-alb-310963835.ap-northeast-2.elb.amazonaws.com:9856/phone_popup2.jsp",
//     "_blank",
//     "location=no"
//   );
//   identificationFindidInterval = setInterval(identificationFindIdFn, 2000);
// }

function certify() {
  // $('.termsagreePage').remove()
  console.log("certify 실행됨");
  // alertToast("certify 클릭됨")
  $.ajax({
    url: serverURL + "/certify/",
    type: "POST",
    data: { },
    dataType: "json",
    async: true,
    success: function (result) {
      var val = result.value;
      console.log("회원가입 진행")
      if(val == "1") {
        $(".changeSections").each(function () {
          var _this = this;
          $.get("./templates/signupPage.html", function (data) {
            $(_this).append(data);
          });
        });
      } else {
        alertToast("잘못된 접근 입니다") 
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}


function identificationFindIdFn() {
  identificationFindId.executeScript(
    { code: "localStorage.getItem('result')" },
    function (data) {
      if (data[0] != null) {
        data = JSON.parse(data[0]);

        console.log("data.RSLT_CD", data);

        if (data.RSLT_CD == "B100") {
          identificationFindId.close();
          clearInterval(identificationFindidInterval);
          alertToast("본인인증 처리에 실패했습니다.");
          $(".termsPage").remove();
          return false;
        } else if (data.RSLT_CD == "B123") {
          identificationFindId.close();
          clearInterval(identificationFindidInterval);
          alertToast("본인인증 처리를 취소하셨습니다.");
          $(".termsPage").remove();
          return false;
        } else if (data.RSLT_CD == "B092") {
          identificationFindId.close();
          clearInterval(identificationFindidInterval);
          alertToast("본인인증 처리에 실패했습니다.");
          $(".termsPage").remove();
          return false;
        } else {
          $.ajax({
            url: serverURL + "/checkUser/",
            type: "POST",
            data: {
              CP_CD: data.CP_CD,
              DI: data.DI,
              CI: data.CI,
              TX_SEQ_NO: data.TX_SEQ_NO,
              RSLT_CD: data.RSLT_CD,
              TEL_COM_CD: data.TEL_COM_CD,
              RSLT_BIRTHDAY: data.RSLT_BIRTHDAY,
              RSLT_SEX_CD: data.RSLT_SEX_CD,
              RSLT_NAME: data.RSLT_NAME,
              TEL_NO: data.TEL_NO,
            },
            dataType: "json",
            success: function (result) {
              // alertToast(result.msg)
              $("#DI").val(data.DI);
              $("#CI").val(data.CI);
              $("#CP_CD").val(data.CP_CD);
              $("#TX_SEQ_NO").val(data.TX_SEQ_NO);
              $("#RSLT_CD").val(data.RSLT_CD);
              $("#TEL_COM_CD").val(data.TEL_COM_CD);

              if (result.result == "0") {
                // if ($('.signupPage1').css('display') == "block") {
                //     $('.signupPage1').remove()
                // }

                $(".changeSections").each(function () {
                  var _this = this;
                  $.get("./templates/signupPage.html", function (data1) {
                    $(_this).append(data1);
                    $("#signUpRealName").text(data.RSLT_NAME);
                    $("#signUpTelNum").text(data.TEL_NO);
                  });
                });
              } else {
                alertToast("이미 가입된 회원 입니다.");
                $(".termsPage").remove();
              }

              identificationFindId.close();
              clearInterval(identificationFindidInterval);
            },
            error: function (error) {
              $("#loading1").hide();
              console.log(error);
            },
          });
        }
      }
    }
  );
}

function signUpFinal() {
  var name = $("#signUpRealName").val();
  var telNum = $("#signUpTelNum").val();
  var pw = $(".signupPage #signupPass").val();
  var email = $(".signupPage #signUpEmail").val();
  var confirm_password = $("#signupPass2").val();

  //var addr1 = $('#sample2_postcode').val()
  //var addr2 = $('#sample2_address').val()
  //var addr3 = $('#sample2_detailAddress').val()

  var otpCheck = "1";
  var DI = $("#DI").val();
  var CI = $("#CI").val();
  var CP_CD = $("#CP_CD").val();
  var TX_SEQ_NO = $("#TX_SEQ_NO").val();
  var RSLT_CD = $("#RSLT_CD").val();
  var TEL_COM_CD = $("#TEL_COM_CD").val();
  var otpCode = window.localStorage.getItem("secretValOTP"); 

  $.ajax({
    url: serverURL + "/signup/",
    type: "POST",
    data: {
      username: email,
      name: name,
      password: pw,
      phone: telNum,
      otpCheck: otpCheck,
      otpCode: otpCode,
      DI: DI,
      CI: CI,
      CP_CD: CP_CD,
      TX_SEQ_NO: TX_SEQ_NO,
      RSLT_CD: RSLT_CD,
      TEL_COM_CD: TEL_COM_CD,
    },
    dataType: "json",
    async: true,
    success: function (result) {
      $.ajax({
        url: serverURL + "/login/",
        type: "POST",
        data: { username: email, password: pw },
        dataType: "json",
        async: true,
        success: function (result) {
          var val = result.value;
          if (val == "1") {
            window.localStorage.setItem(
              "userinfo",
              JSON.stringify(result.user)
            );
            userinfo = JSON.parse(window.localStorage.getItem("userinfo"));

            if ($("input:checkbox[id=saveID]").is(":checked")) {
              window.localStorage.setItem(
                "saveID",
                JSON.stringify({ YN: "Y", id: email })
              );
            } else {
              window.localStorage.setItem(
                "saveID",
                JSON.stringify({ YN: "N", id: email })
              );
              $("#loginEmail").val("");
            }
            if ($("input:checkbox[id=autologin]").is(":checked")) {
              window.localStorage.setItem(
                "autologin",
                JSON.stringify({ YN: "Y" })
              );
            } else {
              window.localStorage.setItem(
                "autologin",
                JSON.stringify({ YN: "N" })
              );
              $("#loginEmail").val("");
            }

            $(".changeSections").each(function () {
              var _this = this;
              $.get("./templates/signupCompPage.html", function (data) {
                $(_this).append(data);
              });
              numCount = 0;
              inputNum = "";
              $("#hidechk").val("");
            });
          } else if (val == "-9") {
            $("#loading1").hide();
            alertToast("아이디 또는 비밀번호가 올바르지 않습니다.");
          } else {
            $(".changeSections").each(function () {
              var _this = this;
              $.get("./templates/signupCompPage.html", function (data) {
                $(_this).append(data);
              });
            });

            // 남아 있는 페이지 모두 정리
            $(".termsPage").remove();
            $(".signupCompPage").remove();
          }
        },
        error: function (error) {
          $("#loading1").hide();
          console.log(error);
        },
      });

      setTimeout(function () {
        $(".loginPage").remove();
        $(".signupPage").remove();
        $(".otpAddPage").remove();
        $(".otpconfPage").remove();
      }, 100);
      $("#loginEmail").val(email);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

var isClicked = false;
function loginFnReal(button) {
  // alertToast("로그인 클릭");
  // $('#loading1').show()
  if(isClicked) return;
  isClicked = true;
  button.style.opacity = "0.5";
  console.log("클릭됨")
  var loginEmail = $("#loginEmail").val();
  var loginPw = $("#loginPassword").val();
  var reg =
    /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

  if (loginEmail == "") {
    $("#loginEmailBox").addClass("err");
    alertToast("이메일을 확인해주세요.");
  } else {
    if (reg.test(loginEmail) == false) {
      $("#loginEmailBox").addClass("err");
      alertToast("이메일을 확인해주세요.");
    } else {
      $("#loginEmailBox").removeClass("err");
      alertToast("로그인 중입니다");
      setTimeout( function () {
        $.ajax({
          url: serverURL + "/login/",
          type: "POST",
          data: { username: loginEmail, password: loginPw },
          dataType: "json",
          async: true,
          success: function (result) {
            var val = result.value;
            // alertToast(`${val}`);
            if (val == "1") {
              window.localStorage.setItem(
                "userinfo",
                JSON.stringify(result.user)
              );
              userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
  
              if ($("input:checkbox[id=saveID]").is(":checked")) {
                window.localStorage.setItem(
                  "saveID",
                  JSON.stringify({ YN: "Y", id: loginEmail })
                );
              } else {
                window.localStorage.setItem(
                  "saveID",
                  JSON.stringify({ YN: "N", id: loginEmail })
                );
                // $('#loginEmail').val('')
              }
              if ($("input:checkbox[id=autologin]").is(":checked")) {
                window.localStorage.setItem(
                  "autologin",
                  JSON.stringify({ YN: "Y" })
                );
              } else {
                window.localStorage.setItem(
                  "autologin",
                  JSON.stringify({ YN: "N" })
                );
                // $('#loginEmail').val('')
              }
  
              $(".changeSections").each(function () {
                var _this = this;
                $.get("./templates/otpconfPage.html", function (data) {
                  $(_this).append(data);
                  // $('#loading1').hide()
                  
                  $(".startingPage").remove();
                  isClicked = false;
                  button.style.opacity = "1";
                  // $('.loginPage').remove()
                });
              });
            } else if (val == "2") {
              // $('#loading1').hide()
              alertToast("이메일을 확인해주세요.");
              $("#loginiderr").addClass("err");
            } else {
              // { $('#loading1').hide()
              alertToast("비밀번호를 확인해주세요.");
              $("#loginpwerr").addClass("err");
            }
          },
          error: function (error) {
            // alertToast(`에러 메시지: ${error.responseText}`); // 에러 응답 내용을 보여줌
            alertToast(`에러 메시지: ${error.status, error.statusText}`); // 에러 응답 내용을 보여줌
            console.log(error);
          },
        });
      },1000)
      
    }
  }
}

function hashCopy(hash) {
  cordova.plugins.clipboard.copy(hash);
  alertToast("클립보드에 저장되었습니다.");
}

function checkQrhtml() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/otpAddPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function checkOtpHtml() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/checkOtp.html", function (data) {
      $(_this).append(data);
    });
  });
}

/* 버튼Fn */
function MainFn() {
  console.log("로그인 버튼 클릭");
  $(".ethhistoryPage").remove();
  $(".wallDisabledPop").remove();
  $(".exchPage1").remove();
  $(".exchPage2").remove();
  $(".exchcompPage1").remove();
  $(".exchcompPage2").remove();
  $(".gdschistoryPage").remove();
  $(".mainPage").remove();
  $(".mywallPage").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/mainPage.html", function (data) {
      $(_this).append(data);
      userinfoUpdate();
      gdscTx();
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      console.log("ajax 성공");
      var data = JSON.parse(result.SafeNewsinfo);
      var html = "";
      console.log("뉴스 ㄱ");
      console.log(data);

      for (i = 0; i < 4; i++) {
        var newsTit = data[i]["fields"]["newsTitle"];
        var newsTime = data[i]["fields"]["newsRegisDate"];
        var newsClass = data[i]["fields"]["newsClass"];
        var newsStatus = data[i]["fields"]["newsStatus"];
        var dataT = data[i]["fields"]["newsRegisDate"];
        var date1 = formatDate2(new Date());
        var date2 = formatDate2(dataT);

        if (newsClass == "0") {
          if (newsStatus == "0") {
            html += '<li onclick="lawdetailFn(' + i + ')">';
            html += '<div class="newsCont">';
            html += "<p>&#8226&nbsp;" + newsTit + "</p>";
            if (date1 === date2) {
              html += '<span class="on">';
            } else {
              html += "<span>";
            }
            html +=
              '<div class="frame"><img src="img/newicon.png" alt=""></div>' +
              formatDate2(newsTime) +
              "";
            html += "</span>";
            html += "</div>";
            html += "</li>";
          }
        } else if (newsClass == "1") {
          if (newsStatus == "0") {
            html += '<li onclick="techdetailFn(' + i + ')">';
            html += '<div class="newsCont">';
            html += "<p>&#8226&nbsp;" + newsTit + "</p>";
            if (date1 === date2) {
              html += '<span class="on">';
            } else {
              html += "<span>";
            }
            html +=
              '<div class="frame"><img src="img/newicon.png" alt=""></div>' +
              formatDate2(newsTime) +
              "";
            html += "</span>";
            html += "</div>";
            html += "</li>";
          }
        } else if (newsClass == "2") {
          if (newsStatus == "0") {
            html += '<li onclick="disasterguideFn(' + i + ')">';
            html += '<div class="newsCont">';
            html += "<p>&#8226&nbsp;" + newsTit + "</p>";
            if (date1 === date2) {
              html += '<span class="on">';
            } else {
              html += "<span>";
            }
            html +=
              '<div class="frame"><img src="img/newicon.png" alt=""></div>' +
              formatDate2(newsTime) +
              "";
            html += "</span>";
            html += "</div>";
            html += "</li>";
          }
        }
      }
      $(".mainPage .main .saveNews ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function signupFn() {
  console.log("회원가입 버튼 클릭");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/termsPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function confPassFn() {
  $(".confPasswordPage").remove();
  console.log("다음 버튼 클릭");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/confPasswordPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function confEmailFn() {
  console.log("비밀번호 찾기 버튼 클릭");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/confEmail.html", function (data) {
      $(_this).append(data);
    });
  });
}

function pwdClearFn() {
  console.log("비밀번호 재설정 완료 확인");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/passclearPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function loginFn() {
  console.log("로그인 화면 이동");
  $(".passclear").remove();
  $(".loginPage").remove();
  $(".infoPage1").remove();
  $(".infoPage2").remove();
  $(".signupCompPage").remove();

  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/loginPage.html", function (data) {
      $(_this).append(data);
    });
  });
}



function signupCompFn() {
  console.log("회원가입 완료");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/signupCompPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function infoPage2Fn() {
  console.log("소개 다음 버튼");

  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/infoPage2.html", function (data) {
      $(_this).append(data);
    });
  });
}

function myPageFn() {
  console.log("내정보 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/myPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function bellsetFn() {
  console.log("알람설정 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/bellsetPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function tersconfFn() {
  console.log("약관확인 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/termsconfPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function versionFn() {
  console.log("버전정보 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/versionPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function gdstChFn() {
  $(".exchcompPage1").remove();
  $(".exchcompPage2").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/gdstCHhistoryPage.html", function (data) {
      $(_this).append(data);
      $.ajax({
        url: serverURL + "/TtoClist/",
        type: "POST",
        data: { userPK: userinfo.id },
        dataType: "json",
        async: true,
        success: function (result) {
          var data = JSON.parse(result.chlist);
          var html1 = "";
          var html2 = "";
          var html = "";
          var chCount1 = result.chCount1;
          var chCount2 = result.chCount2;
          if (chCount1 == 0) {
            console.log("0개인데?");
            console.log("gdsc0개인데?");
            $(".gdstCHhistoryPage .contArea .historyArea .hisList2 ul").html(
              ""
            );
            html1 += '<li class="nodata">';
            html1 +=
              '<span class="frame"><img src="img/nodata.png" alt="노데이터"></span>';
            html1 += "<p>조회내역이 없습니다.</p>";
            html1 += "</li>";
            $(".gdstCHhistoryPage .contArea .historyArea .hisList2 ul").html(
              html1
            );
          }
          if (chCount2 == 0) {
            console.log("0개인데?");
            $(".gdstCHhistoryPage .contArea .historyArea .hisList1 ul").html(
              ""
            );
            html2 += '<li class="nodata">';
            html2 +=
              '<span class="frame"><img src="img/nodata.png" alt="노데이터"></span>';
            html2 += "<p>조회내역이 없습니다.</p>";
            html2 += "</li>";
            $(".gdstCHhistoryPage .contArea .historyArea .hisList1 ul").html(
              html2
            );
          }
          for (i = 0; i < data.length; i++) {
            var timeStamp = data[i]["fields"]["timeStamp"];
            var gdsc = data[i]["fields"]["gdsc"];
            var gdst = data[i]["fields"]["gdst"];
            var status = data[i]["fields"]["status"];
            gdsc = parseFloat(gdsc);

            if (status == "1") {
              html1 += "<li>";
              html1 += '<div class="contsec">';
              html1 += '<span class="stat">환전</span>';
              html1 += '<div class="info">';
              html1 += '<span class="dataTime">' + timeStamp + "</span>";
              html1 +=
                '<span class="gdsc"><em class="num">' +
                gdsc.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                "</em>GDSC</span>";
              html1 +=
                '<p>&nbsp<span class="fee"><em class="num"></em></span></p>';
              html1 += "</div>";
              html1 += "</div>";
              html1 += "</li>";
            }
            if (status == "2") {
              html2 += "<li>";
              html2 += '<div class="contsec">';
              html2 += '<span class="stat">환전</span>';
              html2 += '<div class="info">';
              html2 += '<span class="dataTime">' + timeStamp + "</span>";
              html2 +=
                '<span class="gdst"><em class="num">' +
                gdst +
                "</em>GDST</span>";
              html2 +=
                '<p>&nbsp<span class="fee"><em class="num"></em></span></p>';
              html2 += "</div>";
              html2 += "</div>";
              html2 += "</li>";
            }
          }
          $(".gdstCHhistoryPage .contArea .historyArea .hisList2 ul").html(
            html1
          );
          $(".gdstCHhistoryPage .contArea .historyArea .hisList1 ul").html(
            html2
          );
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  });
}
function resiliPopFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/resiliPop.html", function (data) {
      $(_this).append(data);
    });
  });
}

function exchcomp1Fn() {
  console.log("환전 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/exchcompPage1.html", function (data) {
      $(_this).append(data);
    });
  });
}

function exch1Fn() {
  console.log("환전 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/exchPage1.html", function (data) {
      $(_this).append(data);
      var GDST = userinfo.GDSTamount;
      html = "";
      html += '<div class="topCont">';
      html += '<span class="frame"><img src="img/gdstlogo.png" alt=""></span>';
      html +=
        '<input type="text" id="gdscExchVal" placeholder="사용 가능 수량: ' +
        GDST.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        '" readonly/>';
      html += '<span class="frame1"><img src="img/exch.png" alt=""></span>';
      html += "</div>";
      html += '<div class="btmCont">';
      html += '<span class="frame"><img src="img/logo.png" alt=""></span>';
      html +=
        '<input type="text" placeholder="사용 가능 수량: ' +
        ((1200 / gdscKRW()) * GDST)
          .toFixed(3)
          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        '" id="gdstCHgdsc" readonly/>';
      html += "</div>";
      html += '<div class="clickNum">';
      html += '<ul class="clearfix">';
      html += "<li>";
      html += '<input type="hidden" value="1">';
      html += '<a href="#">1</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="2">';
      html += '<a href="#">2</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="3">';
      html += '<a href="#">3</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="4">';
      html += '<a href="#">4</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="5">';
      html += '<a href="#">5</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="6">';
      html += '<a href="#">6</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="7">';
      html += '<a href="#">7</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="8">';
      html += '<a href="#">8</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="9">';
      html += '<a href="#">9</a>';
      html += "</li>";
      html += "<li>";
      html += '<span class="blind">noneButton</span>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="0">';
      html += '<a href="#">0</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="">';
      html += '<a href="#"><img src="img/numdelete.png" alt=""></a>';
      html += "</li>";
      html += "</ul>";
      html += "</div>";
      html += '<div class="exchBtn">';
      html += '<a href="#" onclick="tTOc()">환전</a>';
      html += "</div>";
      $(".exchPage1 .exch").html(html);
      var inputNum = "";
      $(".exchPage1 .exch .clickNum ul li a").on("click", function () {
        var thisNum = $(this).siblings().val();
        if (thisNum == "") {
          inputNum = inputNum.slice(0, -1);
          console.log("inputNum: ", inputNum);
          $("#gdscExchVal").val(inputNum.replace(/(^0+)/, ""));
        } else {
          inputNum += thisNum;
          var waitinputNum = Number(inputNum);
          if (waitinputNum >= Number(userinfo.GDSTamount)) {
            inputNum = userinfo.GDSTamount;
            $("#gdscExchVal").val(
              inputNum
                .replace(/(^0+)/, "")
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          } else {
            $("#gdscExchVal").val(
              inputNum
                .replace(/(^0+)/, "")
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
          console.log("waitinputNum: ", waitinputNum);
          console.log("inputNum: ", inputNum);
        }
        if (inputNum.replace(/(^0+)/, "") == "") {
          $("#gdstCHgdsc").val("");
        } else {
          var Ninputnum = (1200 / 
            gdscKRW()
          ) * Number(inputNum);
          $("#gdstCHgdsc").val(
            Ninputnum.toFixed(3)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }
      });
    });
  });
}

function tTOc() {
  if ($("#gdscExchVal").val() == "") {
    alertToast("환전 수량을 입력 해주세요");
  } else {
    $(".gdstCHhistoryPage").remove();
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/exchcompPage1.html", function (data) {
        $(_this).append(data);
        $.ajax({
          url: serverURL + "/TtoCsave/",
          type: "POST",
          data: {
            userPK: userinfo.id,
            gdsc: $("#gdstCHgdsc").val().replace(/,/g, ""),
            gdst: Number($("#gdscExchVal").val().replace(/,/g, "")),
            status: "1",
          },
          dataType: "json",
          async: true,
          success: function (result) {
            console.log("result.value: ", result.value);
          },
          error: function (error) {
            console.log(error);
          },
        });
      });
    });
  }
}

function withdrawFnGDSC() {
  $(".withdrawPage2").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/withdrawPage2.html", function (data) {
      $(_this).append(data);
    });
  });
}

function withdrawFn() {
  console.log("출금 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/withdrawPage1.html", function (data) {
      $(_this).append(data);
      $.ajax({
        url: "https://api.upbit.com/v1/ticker?markets=KRW-ETH",
        type: "GET",
        data: {},
        dataType: "json",
        async: true,
        success: function (result) {
          var upeth = result[0]["trade_price"];
          var myKRW = upeth * parseFloat(userinfo.ethValue);
          const setmyKRW = myKRW
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          console.log("setmyKRW: ", setmyKRW);
          $("#ethkrw").text(
            chethkrw(userinfo.ethValue)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
          );
          $("#loading1").hide();
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  });
}

function gdsckeyup() {
  var gdscNum = parseFloat($("#gdscNum").val());
  var Addr = $("#gdsctoAddr").val();
  $("#totalGDSC").text(gdscNum);
  if (
    userinfo.GDSCamount >= gdscNum &&
    userinfo.GDSCamount >= 150 &&
    gdscNum >= 150 &&
    Addr != userinfo.ethAddr &&
    Addr != "" &&
    userinfo.ethValue >= 0.005
  ) {
    $("#gdscWithNext").addClass("on");
    $("#gdscWithNext").attr("onclick", "withGDSCFn()");
  } else {
    $("#gdscWithNext").removeClass("on");
    $("#gdscWithNext").attr("onclick", "");
  }
}

function ethkeyup() {
  var ethValue = $("#ethnum").val();
  console.log("ethValue: ", ethValue);
  var total = (ethValue - 0.02) * 1000000000000000000;
  console.log("total: ", total / 1000000000000000000);
  var realTotal = (total / 1000000000000000000).toFixed(3);
  $("#totalethgas").text(realTotal);
  var addr = $("#ethtoAddr").val();
  if (
    userinfo.ethValue >= ethValue &&
    userinfo.ethValue >= 0.05 &&
    ethValue >= 0.05 &&
    ethtoAddr != userinfo.ethAddr &&
    $("#ethtoAddr").val() != ""
  ) {
    $("#ethWithNext").addClass("on");
    $("#ethWithNext").attr("onclick", "ethOtpconfPageFn()");
  } else {
    $("#ethWithNext").removeClass("on");
    $("#ethWithNext").attr("onclick", "");
  }
}

function withGDSCFn() {
  console.log("출금 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/withdrawclear.html", function (data) {
      $(_this).append(data);
    });
  });
  var toAddr = $("#gdsctoAddr").val();
  var gdscValue = $("#gdscNum").val();
  $.ajax({
    url: serverURL + "/gdscWithdraw/",
    type: "POST",
    data: {
      userPK: userinfo.id,
      userAddr: userinfo.ethAddr,
      to: toAddr,
      volume: gdscValue,
    },
    dataType: "json",
    async: true,
    success: function (result) {
      console.log("userAddr: ", userAddr);
    },
    error: function (error) {
      console.log(error);
    },
  });
  $(".withdrawPage2").remove();
  $(".gdschistoryPage").remove();
}

function otpconfPageFn() {
  console.log("소식 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/otpconfPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function ethOtpconfPageFn() {
  console.log("소식 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/ethotpPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function withdrawclearFn() {
  console.log("출금 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/withdrawclear.html", function (data) {
      $(_this).append(data);
    });
  });
  var toAddr = $("#ethtoAddr").val();
  var ethValue = $("#ethnum").val();
  var total = ethValue - 0.02;
  var addr = $("#ethtoAddr").val();
  $.ajax({
    url: serverURL + "/ethWithdraw/",
    type: "POST",
    data: {
      userPK: userinfo.id,
      userAddr: userinfo.ethAddr,
      to: toAddr,
      inputAddr: addr,
      volume: total,
      EXethValue: ethValue,
    },
    dataType: "json",
    async: true,
    success: function (result) {},
    error: function (error) {
      console.log(error);
    },
  });
  $(".withdrawPage1").remove();
  $(".ethhistoryPage").remove();
}

function setting1Fn() {
  console.log("소식 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/settingPage1.html", function (data) {
      $(_this).append(data);
    });
  });
}

function setting2Fn() {
  console.log("소식 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/settingPage2.html", function (data) {
      $(_this).append(data);
    });
  });
}

function gdschistoryFn() {
  console.log("GDSC 히스토리 버튼");
  $("#loading1").show();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/gdschistoryPage.html", function (data) {
      $(_this).append(data);
      gdsclookup();
    });
  });
}

function gdscTx() {
  $.ajax({
    url: "https://api-sepolia.etherscan.io/api",
    type: "GET",
    data: {
      module: "account",
      action: "tokenbalance",
      contractaddress: "0xe1A7d6838f59965922D01db42D9038402862797A",
      address: userinfo.ethAddr,
      apikey: ethAPIKey,
    },
    dataType: "json",
    async: true,
    success: function (result) {
      var gdscBalance = result.result / 1000000000000000000;
      console.log("gdscBalance: ", gdscBalance);
      $.ajax({
        url: serverURL + "/userSendGDSC/",
        type: "POST",
        data: {
          userPK: userinfo.id,
          userAddr: userinfo.ethAddr,
          gdscBalance: gdscBalance,
        },
        dataType: "json",
        async: true,
        success: function (result) {},
        error: function (error) {
          $("#loading1").hide();
          console.log(error);
        },
      });
    },
  });
}

function gdsclist() {
  $.ajax({
    url: serverURL + "/userGdscWalletList/",
    type: "POST",
    data: { userPK: userinfo.id, userA: userinfo.ethAddr },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.userlist);
      var listCount = result.countList;
      var html = "";
      console.log("data: ", data);
      moAddr = "0x650D8fb7fFc2495fe632D7adA52C6C4e26E0f927";
      freeAddr = "0xa155abc1da12012702e32f29ee3d91472866ead8";
      if (listCount == 0) {
        html += '<li class="nodata">';
        html +=
          '<span class="frame"><img src="img/nodata.png" alt="노데이터"></span>';
        html += "<p>조회내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var value = data[i]["fields"]["value"];
          value = parseFloat(value).toFixed(3);
          var from = data[i]["fields"]["fromAddr"];
          var to = data[i]["fields"]["to"];
          var datatime = data[i]["fields"]["datetime"];
          if (from.toLowerCase() == userinfo.ethAddr.toLowerCase()) {
            if (to.toLowerCase() != moAddr.toLowerCase()) {
              //출금
              html += '<li class="in"> ';
              html += '<div class="contsec">';
              html += '<span class="stat">출금완료</span>';
              html += '<p class="info1">';
              html += '<span class="dataTime">' + datatime + "</span>";
              html +=
                '<span class="gdsc"><em class="num">' +
                value
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                "</em>GDSC</span>";
              html +=
                '<span class="krw"><em class="num">' +
                (gdscKRW() * value)
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                "</em>KRW</span>";

              html += "</p>";
              html += '<p class="info2">';
              html += '<span class="textbar">to.</span>';
              html += '<span class="omit">' + to + "</span>";
              html +=
                '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
                to +
                '\')"><i class="far fa-copy"></i></a>';
              html += "</p>";
              html += "</div>";
              html += "</li>";
            }
          } else if (to.toLowerCase() == userinfo.ethAddr.toLowerCase()) {
            if (from.toLowerCase() != freeAddr.toLowerCase()) {
              //입금
              html += '<li class="in"> ';
              html += '<div class="contsec">';
              html += '<span class="stat">입금</span>';
              html += '<p class="info1">';
              html += '<span class="dataTime">' + datatime + "</span>";
              html +=
                '<span class="gdsc"><em class="num">' +
                value
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                "</em>GDSC</span>";
              html +=
                '<span class="krw"><em class="num">' +
                (gdscKRW() * value)
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
                "</em>KRW</span>";
              html += "</p>";
              html += '<p class="info2">';
              html += '<span class="textbar">from.</span>';
              html += '<span class="omit">' + from + "</span>";
              html +=
                '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
                to +
                '\')"><i class="far fa-copy"></i></a>';
              html += "</p>";
              html += "</div>";
              html += "</li>";
            }
          }
        }
      }
      $(".gdschistoryPage .contArea .historyArea .hisList ul").html(html);
      $("#loading1").hide();
    },
    error: function (error) {
      console.log(error);
      $("#loading1").hide();
    },
  });
}

// function gdscAllListFn() {
//   $("#loading1").show();
//   $.ajax({
//     url: "https://api-sepolia.etherscan.io/api",
//     type: "GET",
//     data: {
//       module: "account",
//       action: "tokentx",
//       contractaddress: "0xe1A7d6838f59965922D01db42D9038402862797A", //abcd token ca
//       address: userinfo.ethAddr,
//       page: 1,
//       offset: 10,
//       sort: "asc",
//       apikey: ethAPIKey,
//     },
//     dataType: "json",
//     async: true,
//     success: function (result) {
//       var data = result.result;
//       console.log("data: ", data);
//       for (i = 0; i < data.length; i++) {
//         var blockHash = data[i]["blockHash"];
//         var blockNumber = data[i]["blockNumber"];
//         var confirmations = data[i]["confirmations"];
//         var contractAddress = data[i]["contractAddress"];
//         var cumulativeGasUsed = data[i]["cumulativeGasUsed"];
//         var from = data[i]["from"];
//         var gas = data[i]["gas"];
//         var gasPrice = data[i]["gasPrice"];
//         var gasUsed = data[i]["gasUsed"];
//         var hash = data[i]["hash"];
//         var input = data[i]["input"];
//         var nonce = data[i]["nonce"];
//         var timeStamp = data[i]["timeStamp"];
//         var to = data[i]["to"];
//         var tokenDecimal = data[i]["tokenDecimal"];
//         var tokenName = data[i]["tokenName"];
//         var tokenSymbol = data[i]["tokenSymbol"];
//         var transactionIndex = data[i]["transactionIndex"];
//         var value = data[i]["value"];
//         value = value / 1000000000000000000;
//         var datetime = Unix_timestamp(Number(timeStamp));
//         console.log("timeStamp", timeStamp);
//         console.log("datetime", datetime);
//         console.log('넘어가는 blocknumber 는 ?',blockNumber);
//         if (
//           to.toLowerCase() == userinfo.ethAddr.toLowerCase() ||
//           from.toLowerCase() == userinfo.ethAddr.toLowerCase()
//         ) {
//           $.ajax({
//             url: serverURL + "/userGDSCWalletSave/",
//             type: "POST",
//             data: {
//               userPK: userinfo.id,
//               blockHash: blockHash,
//               blockNumber: blockNumber,
//               confirmations: confirmations,
//               cumulativeGasUsed: cumulativeGasUsed,
//               fromAddr: from,
//               gas: gas,
//               gasPrice: gasPrice,
//               gasUsed: gasUsed,
//               hash: hash,
//               input: input,
//               nonce: nonce,
//               timeStamp: Unix_timestamp(Number(timeStamp)),
//               to: to,
//               tokenDecimal: tokenDecimal,
//               tokenName: tokenName,
//               tokenSymbol: tokenSymbol,
//               transactionIndex: transactionIndex,
//               value: value,
//               datetime: datetime,
//             },
//             dataType: "json",
//             async: true,
//             success: function (result) {
//               $("#loading1").hide();
//             },
//           });
//         }
//       }
//     },
//     error: function (error) {
//       console.log(error);
//     }
//   });
//   $("#loading1").hide();
// }

function gdscAllListFn() {
  $("#loading1").show();
  let page = 1;
  const transactions = [];

  function fetchTransactions() {
    $.ajax({
      url: "https://api-sepolia.etherscan.io/api",
      type: "GET",
      data: {
        module: "account",
        action: "tokentx",
        contractaddress: "0xe1A7d6838f59965922D01db42D9038402862797A", //abcd token ca
        address: userinfo.ethAddr,
        page: page,
        offset: 10, // 한번에 가져올 트랜잭션 수
        sort: "asc",
        apikey: ethAPIKey,
      },
      dataType: "json",
      async: true,
      success: function (result) {
        var data = result.result;
        console.log("data: ", data);
        
        // 받은 데이터를 transactions 배열에 추가
        transactions.push(...data);

        // 데이터를 계속 가져올 필요가 있는지 확인
        if (data.length === 10) {
          // 10개 이하인 경우 다음 페이지 요청
          page++;
          fetchTransactions();
        } else {
          // 10개 미만인 경우 모든 데이터를 가져온 것으로 간주하고 처리 시작
          processTransactions(transactions);
          $("#loading1").hide();
        }
      },
      error: function (error) {
        console.log(error);
        $("#loading1").hide();
      }
    });
  }

  function processTransactions(data) {
    for (let i = 0; i < data.length; i++) {
      // 트랜잭션 데이터 처리
      var blockHash = data[i]["blockHash"];
      var blockNumber = data[i]["blockNumber"];
      var confirmations = data[i]["confirmations"];
      var contractAddress = data[i]["contractAddress"];
      var cumulativeGasUsed = data[i]["cumulativeGasUsed"];
      var from = data[i]["from"];
      var gas = data[i]["gas"];
      var gasPrice = data[i]["gasPrice"];
      var gasUsed = data[i]["gasUsed"];
      var hash = data[i]["hash"];
      var input = data[i]["input"];
      var nonce = data[i]["nonce"];
      var timeStamp = data[i]["timeStamp"];
      var to = data[i]["to"];
      var tokenDecimal = data[i]["tokenDecimal"];
      var tokenName = data[i]["tokenName"];
      var tokenSymbol = data[i]["tokenSymbol"];
      var transactionIndex = data[i]["transactionIndex"];
      var value = data[i]["value"];
      value = value / 1000000000000000000;
      var datetime = Unix_timestamp(Number(timeStamp));
      console.log('넘어가는 blocknumber 는 ?',blockNumber);

      if (
        to.toLowerCase() === userinfo.ethAddr.toLowerCase() ||
        from.toLowerCase() === userinfo.ethAddr.toLowerCase()
      ) {
        $.ajax({
          url: serverURL + "/userGDSCWalletSave/",
          type: "POST",
          data: {
            userPK: userinfo.id,
            blockHash: blockHash,
            blockNumber: blockNumber,
            confirmations: confirmations,
            cumulativeGasUsed: cumulativeGasUsed,
            fromAddr: from,
            gas: gas,
            gasPrice: gasPrice,
            gasUsed: gasUsed,
            hash: hash,
            input: input,
            nonce: nonce,
            timeStamp: Unix_timestamp(Number(timeStamp)),
            to: to,
            tokenDecimal: tokenDecimal,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            transactionIndex: transactionIndex,
            value: value,
            datetime: datetime,
          },
          dataType: "json",
          async: true,
          success: function (result) {
            console.log("Transaction saved:", result);
          },
        });
      }
    }
  }

  fetchTransactions();
}


function ethhistoryFn() {
  $("#loading1").show();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/ethhistoryPage.html", function (data) {
      $(_this).append(data);
      ethlookup();
      $.ajax({
        url: "https://api.upbit.com/v1/ticker?markets=KRW-ETH",
        type: "GET",
        data: {},
        dataType: "json",
        async: true,
        success: function (result) {
          var upeth = result[0]["trade_price"];
          var myKRW = upeth * parseFloat(userinfo.ethValue);
          const setmyKRW = myKRW
            .toString()
            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
          console.log("setmyKRW: ", setmyKRW);
          $("#ethhistoryPageETHKrw").text(
            chethkrw(userinfo.ethValue)
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
          );
          $("#loading1").hide();
        },
        error: function (error) {
          console.log(error);
        },
      });
    });
  });
}

function ethlookup() {
  $("#loading1").show();
  userinfoUpdate();
  if ($("#ethsrchTime1").attr("class") == "btn1 on") {
    var timeBtn = "오늘";
  } else if ($("#ethsrchTime2").attr("class") == "btn2 on") {
    var timeBtn = "1개월";
  } else if ($("#ethsrchTime3").attr("class") == "btn3 on") {
    var timeBtn = "3개월";
  } else {
    var timeBtn = "";
  }
  if ($("#ethsrchBtn2").attr("class") == "btn2 on") {
    var gdstWall = "in";
  } else if ($("#ethsrchBtn3").attr("class") == "btn3 on") {
    var gdstWall = "out";
  } else {
    var gdstWall = "all";
  }
  $.ajax({
    url: serverURL + "/ethlookTime/",
    type: "POST",
    data: {
      timeStart: $("#datepick3").val(),
      timeEnd: $("#datepick4").val(),
      timeBtn: timeBtn,
      userPK: userinfo.id,
      userA: userinfo.ethAddr,
      gdstWall: gdstWall,
    },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.timeValue);
      var dataCount = result.timeValueCount;
      var html = "";
      var userAddr = userinfo.ethAddr;
      userAddr = userAddr.toLowerCase();
      console.log("data: ", data);
      if (dataCount == 0) {
        html += '<li class="nodata">';
        html +=
          '<span class="frame"><img src="img/nodata.png" alt="노데이터"></span>';
        html += "<p>조회내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var eth = data[i]["fields"]["eth"];
          var from = data[i]["fields"]["fromAddr"];
          var to = data[i]["fields"]["toAddr"];
          var datatime = data[i]["fields"]["timeStamp"];
          var ETHK = parseFloat(eth).toFixed(3);
          var moAddr = "0x1721DE2111C2061E9a67fB112728897E16705F04";
          var freeAddr = "0xa155abc1da12012702e32f29ee3d91472866ead8";
          console.log("from: ", from);
          console.log("userinfo.ethAddr: ", userinfo.ethAddr);
          if (from.toLowerCase() == userinfo.ethAddr.toLowerCase()) {
            console.log(
              "같다같다같다같다같다같다같다같다같다같다같다같다같다같다"
            );
          }
          if (to.toLowerCase() == userAddr.toLowerCase()) {
            if (from.toLowerCase() != freeAddr.toLowerCase()) {
              html += '<li class="in">';
              html += '<div class="contsec">';
              html += '<span class="stat">입금</span>';
              html += '<p class="info1">';
              html += '<span class="dataTime">' + datatime + "</span>";
              html +=
                '<span class="gdsc"><em class="num">' + ETHK + "</em>ETH</span>";
              html +=
                '<span class="krw"><em class="num">' +
                krwCh(ETHK) +
                "</em>KRW</span>";
              html += "</p>";
              html += '<p class="info2">';
              html += '<span class="textbar">from.</span>';
              html += '<span class="omit">' + from + "</span>";
              html +=
                '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
                to +
                '\')"><i class="far fa-copy"></i></a>';
              html += "</p>";
              html += "</div>";
              html += "</li>";
            }
            
          } else if (from.toLowerCase() == userAddr.toLowerCase()) {
            if(to.toLowerCase() != moAddr.toLowerCase()) {
              html += '<li class="out">';
              html += '<div class="contsec">';
              html += '<span class="stat">출금완료</span>';
              html += '<p class="info1">';
              html += '<span class="dataTime">' + datatime + "</span>";
              html +=
                '<span class="gdsc"><em class="num">' + ETHK + "</em>ETH</span>";
              html +=
                '<span class="krw"><em class="num">' +
                krwCh(ETHK) +
                "</em>KRW</span>";
              html += "</p>";
              html += '<p class="info2">';
              html += '<span class="textbar">to.</span>';
              html += '<span class="omit">' + to + "</span>";
              html +=
                '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
                to +
                '\')"><i class="far fa-copy"></i></a>';
              html += "</p>";
              html += "</div>";
              html += "</li>";
            }
          }
        }
      }
      var ETH = parseFloat(userinfo.ethValue);
      $("#ethhistoryPageETHAmount").text(ETH.toFixed(3));
      $(".ethhistoryPage .contArea .historyArea .hisList ul").html(html);
      $("#loading1").hide();
    },
  });
}

function gdsclookup() {
  $("#loading1").show();
  userinfoUpdate();
  if ($("#gdscsrchTime1").attr("class") == "btn1 on") {
    var timeBtn = "오늘";
  } else if ($("#gdscsrchTime2").attr("class") == "btn2 on") {
    var timeBtn = "1개월";
  } else if ($("#gdscsrchTime3").attr("class") == "btn3 on") {
    var timeBtn = "3개월";
  } else {
    var timeBtn = "";
  }
  if ($("#gdscsrchBtn2").attr("class") == "btn2 on") {
    var gdstWall = "in";
  } else if ($("#gdscsrchBtn3").attr("class") == "btn3 on") {
    var gdstWall = "out";
  } else {
    var gdstWall = "all";
  }
  $.ajax({
    url: serverURL + "/gdsclookTime/",
    type: "POST",
    data: {
      timeStart: $("#datepick1").val(),
      timeEnd: $("#datepick2").val(),
      timeBtn: timeBtn,
      userPK: userinfo.id,
      userA: userinfo.ethAddr,
      gdstWall: gdstWall,
    },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.timeValue);
      var dataCount = result.timeValueCount;
      var html = "";
      var userAddr = userinfo.ethAddr;
      userAddr = userAddr.toLowerCase();
      console.log("data: ", data);
      if (dataCount == 0) {
        html += '<li class="nodata">';
        html +=
          '<span class="frame"><img src="img/nodata.png" alt="노데이터"></span>';
        html += "<p>조회내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var datatime = data[i]["fields"]["datetime"];
          var value = data[i]["fields"]["value"];
          value = parseFloat(value).toFixed(3);
          var from = data[i]["fields"]["fromAddr"];
          var to = data[i]["fields"]["to"];
          console.log("from: ", from);
          if (from == userinfo.ethAddr) {
            console.log("같다같다같다같다같다같다같다같다같다같다");
          }
          console.log("datatime: ", datatime);
          if (to == userAddr) {
            console.log("to 같다: ", to, " - ", userAddr);
            html += '<li class="in"> ';
            html += '<div class="contsec">';
            html += '<span class="stat">입금</span>';
            html += '<p class="info1">';
            html += '<span class="dataTime">' + datatime + "</span>";
            html +=
              '<span class="gdsc"><em class="num">' +
              value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
              "</em>GDSC</span>";
            html +=
              '<span class="krw"><em class="num">' +
              (gdscKRW() * value)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
              "</em>KRW</span>";
            html += "</p>";
            html += '<p class="info2">';
            html += '<span class="textbar">to.</span>';
            html += '<span class="omit">' + from + "</span>";
            html +=
              '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
              to +
              '\')"><i class="far fa-copy"></i></a>';
            html += "</p>";
            html += "</div>";
            html += "</li>";
          } else if (from == userinfo.ethAddr) {
            console.log("from 같다: ", from, " - ", userAddr);
            html += '<li class="in"> ';
            html += '<div class="contsec">';
            html += '<span class="stat">출금완료</span>';
            html += '<p class="info1">';
            html += '<span class="dataTime">' + datatime + "</span>";
            html +=
              '<span class="gdsc"><em class="num">' +
              value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
              "</em>GDSC</span>";
            html +=
              '<span class="krw"><em class="num">' +
              (gdscKRW() * value)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") +
              "</em>KRW</span>";
            html += "</p>";
            html += '<p class="info2">';
            html += '<span class="textbar">to.</span>';
            html += '<span class="omit">' + to + "</span>";
            html +=
              '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
              to +
              '\')"><i class="far fa-copy"></i></a>';
            html += "</p>";
            html += "</div>";
            html += "</li>";
          }
        }
      }
      // console.log("html: ", html);
      $(".gdschistoryPage .contArea .historyArea .hisList ul").html(html);
      $("#loading1").hide();
    },
  });
}

function ETHwalletAllList() {
  $("#loading1").show();
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result2) {
      window.localStorage.setItem("userinfo", JSON.stringify(result2.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var addr = userinfo.ethAddr;
      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  console.log("userPK:", userinfo.id);

  $.ajax({
    url: serverURL + "/userEthWalletList/",
    type: "POST",
    data: { userPK: userinfo.id, userA: userinfo.ethAddr },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.userlist);
      var listCount = result.countList;
      var html = "";
      moAddr = "0x9cf32550e6097b1c80e9d77760077ecdf8d404b7";
      freeAddr = "0xa155abc1da12012702e32f29ee3d91472866ead8";
      console.log("listCount: ", listCount);
      if (listCount == 0) {
        html += '<li class="nodata">';
        html +=
          '<span class="frame"><img src="img/nodata.png" alt="노데이터"></span>';
        html += "<p>조회내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var eth = data[i]["fields"]["eth"];
          var from = data[i]["fields"]["fromAddr"];
          var to = data[i]["fields"]["toAddr"];
          var datatime = data[i]["fields"]["timeStamp"];
          var ETHK = parseFloat(eth).toFixed(3);
          // if (ethsrchBtn1.attr("class"))
          if (from.toLowerCase() == userinfo.ethAddr.toLowerCase()) {
            if (to.toLowerCase() != moAddr.toLowerCase()) {
              html += '<li class="out">';
              html += '<div class="contsec">';
              html += '<span class="stat">출금완료</span>';
              html += '<p class="info1">';
              html += '<span class="dataTime">' + datatime + "</span>";
              html +=
                '<span class="gdsc"><em class="num">' +
                ETHK +
                "</em>ETH</span>";
              html +=
                '<span class="krw"><em class="num">' +
                krwCh(ETHK) +
                "</em>KRW</span>";
              html += "</p>";
              html += '<p class="info2">';
              html += '<span class="textbar">to.</span>';
              html += '<span class="omit">' + to + "</span>";
              html +=
                '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
                to +
                '\')"><i class="far fa-copy"></i></a>';
              html += "</p>";
              html += "</div>";
              html += "</li>";
            }
          } else if (to.toLowerCase() == userinfo.ethAddr.toLowerCase()) {
            if (from.toLowerCase() != freeAddr.toLowerCase()) {
              html += '<li class="in">';
              html += '<div class="contsec">';
              html += '<span class="stat">입금</span>';
              html += '<p class="info1">';
              html += '<span class="dataTime">' + datatime + "</span>";
              html +=
                '<span class="gdsc"><em class="num">' +
                ETHK +
                "</em>ETH</span>";
              html +=
                '<span class="krw"><em class="num">' +
                krwCh(ETHK) +
                "</em>KRW</span>";
              html += "</p>";
              html += '<p class="info2">';
              html += '<span class="textbar">from.</span>';
              html += '<span class="omit">' + from + "</span>";
              html +=
                '<a href="#" class="copyBtn" onclick="hashCopy(\'' +
                to +
                '\')"><i class="far fa-copy"></i></a>';
              html += "</p>";
              html += "</div>";
              html += "</li>";
            }
          }
        }
      }
      var ETH = parseFloat(userinfo.ethValue);
      $("#ethhistoryPageETHAmount").text(ETH.toFixed(3));
      $(".ethhistoryPage .contArea .historyArea .hisList ul").html(html);
      $("#loading1").hide();
    },
    error: function (error) {
      console.log(error);
      $("#loading1").hide();
    },
  });
}

function AllAmount() {
  $.ajax({
    url: serverURL + "/allAmount/",
      type: "POST",
      data: { userPK: userinfo.id },
      dataType: "json",
      async: true,
      success: function (result) {
        var val = result.value;
        if (val !== 0) {
          $("#ETHnum").text(val); // val이 0이 아닐 때만 업데이트
        }
      },
      error: function (error) {
        console.log(error);
      },
  })
  // ETHKrw = $("#mywallPageETHKrw").text();
}

function mywallFn() {
  $("#loading1").show();
  userinfoUpdate();
  if (userinfo.is_active == false) {
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/wallDisabledPop.html", function (data) {
        $(_this).append(data);
      });
    });
  } else {
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/mywallPage.html", function (data) {
        $("#loading1").show();
        $(_this).append(data);
        // ethWalletAllListFn();
        // AllAmount();
        ethAllListSave();
        gdscAllListFn();
        $.ajax({
          url: "https://api.upbit.com/v1/ticker?markets=KRW-ETH",
          type: "GET",
          data: {},
          dataType: "json",
          async: true,
          success: function (result) {
            var upeth = result[0]["trade_price"];
            var myKRW = upeth * parseFloat(userinfo.ethValue);
            myKRW = myKRW.toFixed(0);
            const setmyKRW = myKRW
              .toString()
              .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
            console.log("setmyKRW: ", setmyKRW);
            $("#mywallPageETHKrw").text(setmyKRW);
            // $("#AllAssetAmount").text(setmyKRW);
            $("#loading1").hide();
          },
          error: function (error) {
            console.log(error);
          },
        });
      });
    });
    $.ajax({
      url: serverURL + "/ethTransfer/",
      type: "POST",
      data: { userAddr: userinfo.ethAddr },
      dataType: "json",
      async: true,
      success: function (result) {},
      error: function (error) {
        $("#loading1").hide();
        console.log(error);
      },
    });
  }
}

function solutionAdd() {
  console.log("안전솔루션 버튼");
  var typeNum;

  if ($(".solutionPage1 .solution .pageCont ul li.on").val() == 10) {
    var typeNum = $("#txtVal").val();
  } else {
    var typeNum = $(".solutionPage1 .solution .pageCont ul li.on").val();
  }
  console.log("typeNum: ", typeNum);
  var solutionImgList = JSON.parse(window.localStorage.getItem("solutionImgList"))
  solutionImgList = solutionImgList.toString()
  userinfoUpdate();
  $.ajax({
    url: serverURL + "/SolutionRequest/",
    type: "POST",
    data: {
      userID: userinfo.id,
      buildingType: typeNum,
      userEmail: userinfo.email,
      userName: userinfo.name,
      userPhone: userinfo.phone,
      solutionImg1: userinfo.tempSoluImg1,
      solutionImg2: userinfo.tempSoluImg2,
      solutionImg3: userinfo.tempSoluImg3,
      solutionImg4: userinfo.tempSoluImg4,
      solutionImg5: userinfo.tempSoluImg5,
      solutionImg6: userinfo.tempSoluImg6,
      solutionImgList: solutionImgList,
    },
    dataType: "json",
    async: true,
    success: function (result) {
      console.log("value:", result.value);
      $("#loading1").hide();
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });

  $(".savesolutionPop").remove();
  $(".solutionPage1").remove();
  $(".solutionPage2").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/saveSolutionPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function saveSolutionFn() {
  console.log("안전솔루션 버튼");
  var myGdst = Number(userinfo.GDSTamount);
  console.log("myGdst", myGdst);

  $(".solutionWaringPop").remove();
  $(".savesolutionPop").remove();
  $(".solutionPage1").remove();
  $(".solutionPage2").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/saveSolutionPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function logoutpopFn() {
  console.log("로그아웃 버튼 클릭!!!");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/logoutPop.html", function (data) {
      $(_this).append(data);
    });
  });
}

function newPassword() {
  $(".confPasswordPage").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/confPasswordPage.html", function (data) {
      $(_this).append(data);
    });
  });
}

function confOTPMove() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/confOTP.html", function (data) {
      $(_this).append(data);
    });
  });
}

function Logout() {
  window.localStorage.removeItem("saveID");
  window.localStorage.removeItem("autologin");
  window.localStorage.removeItem("otpNum");
  window.localStorage.removeItem("secretValOTP");
  window.localStorage.removeItem("userinfo");
  // window.localStorage.removeItem("AppfirstTime");
  location.reload();
}

function ComingsoonFn() {
  alertToast("준비중 입니다.");
}

// function ethAllListSave() {
//   $.ajax({
//     url: serverURL + "/updateUserinfo/",
//     type: "POST",
//     data: { userID: userinfo.id },
//     dataType: "json",
//     async: true,
//     success: function (result2) {
//       window.localStorage.setItem("userinfo", JSON.stringify(result2.user));
//       userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
//       var addr = userinfo.ethAddr;
//       console.log(
//         "-------------------유저 정보 업데이트 완료-------------------"
//       );
//     },
//     error: function (error) {
//       $("#loading1").hide();
//       console.log(error);
//     },
//   });
//   var ethAddr = userinfo.ethAddr;
//   $.ajax({
//     url: "https://api-sepolia.etherscan.io/api",
//     type: "GET",
//     data: {
//       module: "account",
//       action: "txlist",
//       address: userinfo.ethAddr,
//       startblock: 0,
//       endblock: 999999999,
//       page: 1,
//       offset: 10,
//       sort: "asc",
//       apikey: ethAPIKey,
//     },
//     dataType: "json",
//     async: true,
//     success: function (result) {
//       var data = result.result;
//       var html = "";
//       var moAddr = "0x9cf32550e6097b1c80e9d77760077ecdf8d404b7"; //mo계좌 제외한 입출금 내역
//       var freeAddr = "0x2b0234aa2ac29e1257ace3b296953aeed623c221";
//       console.log("data: ", data);
//       if (data.length == 0) {
//       } else {
//         for (i = 0; i < data.length; i++) {
//           var blockHash = data[i]["blockHash"];
//           var block = data[i]["blockNumber"];
//           var confirmations = data[i]["confirmations"];
//           var contractAddress = data[i]["contractAddress"];
//           var cumulativeGasUsed = data[i]["cumulativeGasUsed"];
//           var from = data[i]["from"];
//           var gas = data[i]["gas"];
//           var gasPrice = data[i]["gasPrice"];
//           var gasUsed = data[i]["gasUsed"];
//           var hash = data[i]["hash"];
//           var input = data[i]["input"];
//           var isError = data[i]["isError"];
//           var nonce = data[i]["nonce"];
//           var timeStamp = data[i]["timeStamp"];
//           var to = data[i]["to"];
//           var transactionIndex = data[i]["transactionIndex"];
//           var txreceipt_status = data[i]["txreceipt_status"];
//           var volume = data[i]["value"];
//           console.log("timeStamptimeStamptimeStamptimeStamp", timeStamp);
//           console.log(
//             "Unix_timestamp(Number(timeStamp)",
//             Unix_timestamp(Number(timeStamp))
//           );
//           if (
//             to.toLowerCase() == ethAddr.toLowerCase() ||
//             from.toLowerCase() == ethAddr.toLowerCase()
//           ) {
//             if (
//               to.toLowerCase() != moAddr.toLowerCase() ||
//               from.toLowerCase() != freeAddr.toLowerCase()
//             ) {
//               // $("#ETHnum").text(volume);
//               $.ajax({
//                 url: serverURL + "/userEthWalletSave/",
//                 type: "POST",
//                 data: {
//                   userPK: userinfo.id,
//                   userAddr: ethAddr,
//                   blockHash: blockHash,
//                   blockNumber: block,
//                   confirmations: confirmations,
//                   contractAddress: contractAddress,
//                   cumulativeGasUsed: cumulativeGasUsed,
//                   fromAddr: from,
//                   gas: gas,
//                   gasPrice: gasPrice,
//                   gasUsed: gasUsed,
//                   hash: hash,
//                   input: input,
//                   isError: isError,
//                   nonce: nonce,
//                   timeStamp: Unix_timestamp(Number(timeStamp)),
//                   to: to,
//                   transactionIndex: transactionIndex,
//                   txreceipt_status: txreceipt_status,
//                   volume: (volume / 1000000000000000000).toFixed(3),
//                 },
//                 dataType: "json",
//                 async: true,
//                 success: function (result) {},
//                 error: function (error) {
//                   console.log(error);
//                 },
//               });
//             }
//           }
//         }
//       }
//     },
//     error: function (error) {
//       $("#loading1").hide();
//       console.log(error);
//     },
//   });
// }

function ethAllListSave() {
  $("#loading1").show();
  let page = 1;
  const transactions = [];

  function fetchTransactions() {
    $.ajax({
      url: "https://api-sepolia.etherscan.io/api",
      type: "GET",
      data: {
        module: "account",
        action: "txlist",
        address: userinfo.ethAddr,
        startblock: 0,
        endblock: 999999999,
        page: page,
        offset: 10, // 한번에 가져올 트랜잭션 수
        sort: "asc",
        apikey: ethAPIKey,
      },
      dataType: "json",
      async: true,
      success: function (result) {
        var data = result.result;
        
        // 받아온 데이터를 transactions 배열에 추가
        transactions.push(...data);

        // 데이터를 계속 가져올 필요가 있는지 확인
        if (data.length === 10) {
          // 10개를 가져왔으면 더 많은 데이터가 있을 가능성이 있으므로 페이지 증가 후 재요청
          page++;
          fetchTransactions();
        } else {
          // 10개 미만이면 더 이상 데이터가 없으므로 모든 트랜잭션을 처리
          processTransactions(transactions);
          $("#loading1").hide();
        }
      },
      error: function (error) {
        console.log(error);
        $("#loading1").hide();
      }
    });
  }

  function processTransactions(data) {
    var ethAddr = userinfo.ethAddr;
    var moAddr = "0x9cf32550e6097b1c80e9d77760077ecdf8d404b7"; // mo계좌 제외한 입출금 내역
    var freeAddr = "0x2b0234aa2ac29e1257ace3b296953aeed623c221";
    
    for (let i = 0; i < data.length; i++) {
      var blockHash = data[i]["blockHash"];
      var block = data[i]["blockNumber"];
      var confirmations = data[i]["confirmations"];
      var contractAddress = data[i]["contractAddress"];
      var cumulativeGasUsed = data[i]["cumulativeGasUsed"];
      var from = data[i]["from"];
      var gas = data[i]["gas"];
      var gasPrice = data[i]["gasPrice"];
      var gasUsed = data[i]["gasUsed"];
      var hash = data[i]["hash"];
      var input = data[i]["input"];
      var isError = data[i]["isError"];
      var nonce = data[i]["nonce"];
      var timeStamp = data[i]["timeStamp"];
      var to = data[i]["to"];
      var transactionIndex = data[i]["transactionIndex"];
      var txreceipt_status = data[i]["txreceipt_status"];
      var volume = data[i]["value"];
      
      if (
        (to.toLowerCase() == ethAddr.toLowerCase() ||
          from.toLowerCase() == ethAddr.toLowerCase()) &&
        (to.toLowerCase() != moAddr.toLowerCase() &&
          from.toLowerCase() != freeAddr.toLowerCase())
      ) {
        $.ajax({
          url: serverURL + "/userEthWalletSave/",
          type: "POST",
          data: {
            userPK: userinfo.id,
            userAddr: ethAddr,
            blockHash: blockHash,
            blockNumber: block,
            confirmations: confirmations,
            contractAddress: contractAddress,
            cumulativeGasUsed: cumulativeGasUsed,
            fromAddr: from,
            gas: gas,
            gasPrice: gasPrice,
            gasUsed: gasUsed,
            hash: hash,
            input: input,
            isError: isError,
            nonce: nonce,
            timeStamp: Unix_timestamp(Number(timeStamp)),
            to: to,
            transactionIndex: transactionIndex,
            txreceipt_status: txreceipt_status,
            volume: (volume / 1000000000000000000).toFixed(3),
          },
          dataType: "json",
          async: true,
          success: function (result) {
            console.log("Transaction saved:", result);
          },
          error: function (error) {
            console.log(error);
          },
        });
      }
    }
  }

  fetchTransactions();
}


function Unix_timestamp(t) {
  var date = new Date(t * 1000);
  var year = date.getFullYear();
  var month = "0" + (date.getMonth() + 1);
  var day = "0" + date.getDate();
  var hour = "0" + date.getHours();
  var minute = "0" + date.getMinutes();
  var second = "0" + date.getSeconds();
  return (
    year +
    "-" +
    month.substr(-2) +
    "-" +
    day.substr(-2) +
    " " +
    hour.substr(-2) +
    ":" +
    minute.substr(-2) +
    ":" +
    second.substr(-2)
  );
}

function depositHtml() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/depositPage.html", function (data) {
      $(_this).append(data);
      ethDepositFn();
    });
  });
}
function ethDepositFn() {
  // $("#loading1").show();
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result2) {
      window.localStorage.setItem("userinfo", JSON.stringify(result2.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var addr = userinfo.ethAddr;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );

      if (addr) {
        console.log("이 회원은 이더리움 계좌가 존재한다. ^.^");
        $("#ethAddrDepositPage").text(addr);
        console.log("Address for QR:", addr);  // addr 값을 확인
        QRCode.toCanvas(document.getElementById("QrCodeViewId"), addr, function (error) {
          if (error) {
            console.error(error);
          }
        })
        // var qrcode = new QRCode(document.getElementById("QrCodeViewId"), {
        //   text: addr,
        //   // width: "100%",
        //   // height: "100%",
        //   colorDark: "#000000",
        //   colorLight: "#ffffff",
        //   correctLevel: QRCode.CorrectLevel.H,
        // });
        $("#loading1").hide();
      } else {
        console.log("이 회원은 이더리움 계좌가 존재하지 않는다. ㅠㅠ");

        $("#loading1").hide();
        $("#loading2").show();

        $.ajax({
          url: serverURL + "/newAccount/",
          type: "POST",
          data: { userID: userinfo.id },
          dataType: "json",
          async: true,
          success: function (result1) {
            console.log("result1의 값은? ", result1);
            console.log("result1.value의 값은? ", result1.value);

            $.ajax({
              url: serverURL + "/updateUserinfo/",
              type: "POST",
              data: { userID: userinfo.id },
              dataType: "json",
              async: true,
              success: function (result2) {
                window.localStorage.setItem(
                  "userinfo",
                  JSON.stringify(result2.user)
                );
                userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
                var addr = userinfo.ethAddr;

                console.log(
                  "-------------------유저 정보 업데이트 완료-------------------"
                );

                $("#ethAddrDepositPage").text(addr);
                // var qrcode = new QRCode(
                //   document.getElementById("QrCodeViewId"),
                //   {
                //     text: addr,
                //     // width: "100%",
                //     // height: "100%",
                //     colorDark: "#000000",
                //     colorLight: "#ffffff",
                //     correctLevel: QRCode.CorrectLevel.H,
                //   }
                // );

                
                $("#loading2").hide();
              },
              error: function (error) {
                $("#loading2").hide();
                console.log(error);
              },
            });
          },
          error: function (error) {
            $("#loading2").hide();
            console.log(error);
          },
        });
      }
      
      $("#loading1").hide();
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // 정규식을 이용해서 3자리 마다 , 추가
}

function formatDate(value) {
  if (value) {
    Number.prototype.padLeft = function (base, chr) {
      var len = String(base || 10).length - String(this).length + 1;
      return len > 0 ? new Array(len).join(chr || "0") + this : this;
    };
    var d = new Date(value);
    d.setHours(d.getHours());
    var dformat =
      [
        d.getFullYear().padLeft() % 1000,
        (d.getMonth() + 1).padLeft(),
        d.getDate(),
      ].join(".") +
      " " +
      [d.getHours().padLeft(), d.getMinutes().padLeft()].join(":");

    return dformat;
  }
}

function formatDate1(value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  let formatted_date =
    year +
    "-" +
    ("00" + month.toString()).slice(-2) +
    "-" +
    ("00" + day.toString()).slice(-2);
  return formatted_date;
}

function formatDate2(value) {
  var date = new Date(value);
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  let formatted_date =
    ("00" + month.toString()).slice(-2) +
    "-" +
    ("00" + day.toString()).slice(-2);
  return formatted_date;
}

function savenewsALLFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/savenewsALLPage.html", function (data) {
      $(_this).append(data);
      $(".savenewsLAWPage").remove();
      $(".savenewsTECHPage").remove();
      $(".savenewsDISPage").remove();
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.SafeNewsinfo);
      var html = "";
      var count = result.appCount;
      // console.log(data[1]["fields"]["newsClass"])
      if (count == 0) {
        html += '<li class="nodata">';
        html += '<span class="frame"><img src="img/nodata2.png" alt=""></span>';
        html += "<p>뉴스 내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var newsClass = data[i]["fields"]["newsClass"];
          var newsTit = data[i]["fields"]["newsTitle"];
          var newsTime = data[i]["fields"]["newsRegisDate"];
          var newsStatus = data[i]["fields"]["newsStatus"];
          console.log("newsStatus", i, ":", newsStatus);
          if (newsStatus == 0) {
            if (newsClass == "0") {
              html += '<li onclick="lawdetailFn(' + i + ')">';
              html += '<div class="newsCont">';
              html += '<p class="contTit">건축법규</p>';
              html += '<p class="contTxt">' + newsTit + "</p>";
              html += "<span>" + formatDate1(newsTime) + "</span>";
              html += "</div>";
              html += "</li>";
            } else if (newsClass == "1") {
              html += '<li onclick="techdetailFn(' + i + ')">';
              html += '<div class="newsCont">';
              html += '<p class="contTit">건축기법</p>';
              html += '<p class="contTxt">' + newsTit + "</p>";
              html += "<span>" + formatDate1(newsTime) + "</span>";
              html += "</div>";
              html += "</li>";
            } else if (newsClass == "2") {
              html += '<li onclick="disasterguideFn(' + i + ')">';
              html += '<div class="newsCont">';
              html += '<p class="contTit">재해예방가이드</p>';
              html += '<p class="contTxt">' + newsTit + "</p>";
              html += "<span>" + formatDate1(newsTime) + "</span>";
              html += "</div>";
              html += "</li>";
            }
          } else if (newsStatus == 1) {
            null;
          }
        }
      }

      console.log(html);
      $(".savenewsALLPage .saveNews ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function savenewsLAWFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/savenewsLAWPage.html", function (data) {
      $(_this).append(data);
      $(".savenewsALLPage").remove();
      $(".savenewsTECHPage").remove();
      $(".savenewsDISPage").remove();
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.SafeNewsinfo);
      var dataT = data[1]["fields"]["newsRegisDate"];
      var html = "";
      var dataC = result.newCount0;
      if (dataC == 0) {
        html += '<li class="nodata">';
        html += '<span class="frame"><img src="img/nodata2.png" alt=""></span>';
        html += "<p>뉴스 내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var newsClass = data[i]["fields"]["newsClass"];
          var newsTit = data[i]["fields"]["newsTitle"];
          var newsTime = data[i]["fields"]["newsRegisDate"];
          var newsStatus = data[i]["fields"]["newsStatus"];

          if (newsStatus == 0) {
            if (newsClass == "0") {
              html += '<li onclick="lawdetailFn(' + i + ')">';
              html += '<div class="newsCont">';
              html += '<p class="contTit">건축법규</p>';
              html += '<p class="contTxt">' + newsTit + "</p>";
              html += "<span>" + formatDate1(newsTime) + "</span>";
              html += "</div>";
              html += "</li>";
            } else {
            }
          } else if (newsStatus == 1) {
            null;
          }
        }
      }

      $(".savenewsLAWPage .saveNews ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function savenewsTECHFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/savenewsTECHPage.html", function (data) {
      $(_this).append(data);
      $(".savenewsALLPage").remove();
      $(".savenewsLAWPage").remove();
      $(".savenewsDISPage").remove();
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.SafeNewsinfo);
      var dataT = data[1]["fields"]["newsRegisDate"];
      var html = "";
      var dataC = result.newCount1;
      if (dataC == 0) {
        html += '<li class="nodata">';
        html += '<span class="frame"><img src="img/nodata2.png" alt=""></span>';
        html += "<p>뉴스 내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var newsClass = data[i]["fields"]["newsClass"];
          var newsTit = data[i]["fields"]["newsTitle"];
          var newsTime = data[i]["fields"]["newsRegisDate"];
          var newsStatus = data[i]["fields"]["newsStatus"];

          if (newsStatus == 0) {
            if (newsClass == "1") {
              html += '<li onclick="techdetailFn(' + i + ')">';
              html += '<div class="newsCont">';
              html += '<p class="contTit">건축기법</p>';
              html += '<p class="contTxt">' + newsTit + "</p>";
              html += "<span>" + formatDate1(newsTime) + "</span>";
              html += "</div>";
              html += "</li>";
            } else {
            }
          } else if (newsStatus == 1) {
            null;
          }
        }
      }
      $(".savenewsTECHPage .saveNews ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function savenewsDISFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/savenewsDISPage.html", function (data) {
      $(_this).append(data);
      $(".savenewsALLPage").remove();
      $(".savenewsLAWPage").remove();
      $(".savenewsTECHPage").remove();
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.SafeNewsinfo);
      var html = "";
      var dataC = result.newCount2;
      if (dataC == 0) {
        html += '<li class="nodata">';
        html += '<span class="frame"><img src="img/nodata2.png" alt=""></span>';
        html += "<p>뉴스 내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var newsClass = data[i]["fields"]["newsClass"];
          var newsTit = data[i]["fields"]["newsTitle"];
          var newsTime = data[i]["fields"]["newsRegisDate"];
          var newsStatus = data[i]["fields"]["newsStatus"];
          var newsImg = data[i]["fields"]["newsImg"];
          var solutionIMG1Path = serverURL + "/static/newsImg/" + newsImg;

          if (newsStatus == 0) {
            if (newsClass == "2") {
              html += '<li onclick="disasterguideFn(' + i + ')">';
              html += '<div class="newsCont">';
              html +=
                '<span class="frame"><img src="' +
                solutionIMG1Path +
                '" alt=""></span>';
              html += '<div class="txtArea">';
              html += "<p>" + newsTit + "</p>";
              html += "<span>" + formatDate1(newsTime) + "</span>";
              html += '<span class="tt">&nbsp</span>';
              html += "</div>";
              html += "</div>";
              html += "</li>";
            } else {
            }
          } else if (newsStatus == 1) {
            null;
          }
        }
      }
      $(".savenewsDISPage .saveNews ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function lawdetailFn(value) {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/lawdetailPage.html", function (data) {
      $(_this).append(data);
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var data = JSON.parse(result.SafeNewsinfo);
      var newsTit = data[value]["fields"]["newsTitle"];
      var newsTime = data[value]["fields"]["newsRegisDate"];
      var newsCont = data[value]["fields"]["newsContent"];
      var newsClass = data[value]["fields"]["newsClass"];

      html += '<div class="topCont">';
      html +=
        '<p class="txtTit">건축법규<span>' +
        formatDate1(newsTime) +
        "</span></p>";
      html += '<p class="txtCont">' + newsTit + "</p>";
      html += "</div>";
      html += '<div class="btmCont">';
      html +=
        '<textarea id="" class="addr" readonly>' + newsCont + "</textarea>";
      html += "</div>";
      $(".lawdetailPage .lawDetail").html(html);
      getScHeight();
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function techdetailFn(value) {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/techdetailPage.html", function (data) {
      $(_this).append(data);
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var data = JSON.parse(result.SafeNewsinfo);
      var newsTit = data[value]["fields"]["newsTitle"];
      var newsTime = data[value]["fields"]["newsRegisDate"];
      var newsCont = data[value]["fields"]["newsContent"];

      html += '<div class="topCont">';
      html +=
        '<p class="txtTit">건축기법<span>' +
        formatDate1(newsTime) +
        "</span></p>";
      html += '<p class="txtCont">' + newsTit + "</p>";
      html += "</div>";
      html += '<div class="btmCont">';
      html +=
        '<textarea id="" class="addr" readonly>' + newsCont + "</textarea>";
      html += "</div>";
      $(".techdetailPage .techdetail").html(html);
      getScHeight();
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function disasterguideFn(value) {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/disasterguidePage.html", function (data) {
      $(_this).append(data);
    });
  });

  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var data = JSON.parse(result.SafeNewsinfo);
      var newsTit = data[value]["fields"]["newsTitle"];
      var newsTime = data[value]["fields"]["newsRegisDate"];
      var newsCont = data[value]["fields"]["newsContent"];
      var newsImg = data[value]["fields"]["newsImg"];
      var solutionIMG1Path = serverURL + "/static/newsImg/" + newsImg;

      html += '<div class="guideCont">';
      html +=
        '<span class="frame"><img src="' +
        solutionIMG1Path +
        '" alt=""></span>';
      html += '<p class="tit">' + newsTit + "</p>";
      html += "<span>" + formatDate1(newsTime) + "</span>";
      html +=
        '<textarea id="ele" class="addr" readonly>' + newsCont + "</textarea>";
      html += "</div>";
      $(".disasterguidePage .disasterguid").html(html);
      getScHeight();
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function getScHeight() {
  var scHeight = $("#ele").prop("scrollHeight");
  $("#ele").height(scHeight);
  console.log("높이는", scHeight);
}

function solutionPopFn() {
  var myGdst = Number(userinfo.GDSTamount);
  console.log(myGdst);
  if (myGdst < 50) {
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/solutionWaringPop.html", function (data) {
        $(_this).append(data);
      });
    });
  } else {
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/solutionPop.html", function (data) {
        $(_this).append(data);
      });
    });
  }
}

function solution1Fn() {
  $(".solutionPop").remove();
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/solutionPage1.html", function (data) {
      $(_this).append(data);
    });
  });
}

function camPop() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
    });
  });
}

function savesolutionPop() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/savesolutionPop.html", function (data) {
      $(_this).append(data);
    });
  });
}

function solutioningFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/solutioningPage.html", function (data) {
      $(_this).append(data);
    });
  });
  $.ajax({
    url: serverURL + "/SolutionIng/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var data = JSON.parse(result.SolutionIngInfo);
      var data2 = JSON.parse(result.SolutionIngInfo2);


      if (data2 == 0) {
        html += '<li class="nodata">';
        html += '<span class="frame"><img src="img/nodata1.png" alt=""></span>';
        html += "<p>요청 내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var soluStatus = data[i]["fields"]["soluStatus"];
          var soluType = data[i]["fields"]["buildingType"];
          var soluGdst = data[i]["fields"]["paidGDST"];
          var soluDate = data[i]["fields"]["soluRegisDate"];
          var userEmail = data[i]["fields"]["userEmail"];

          var demoImg0 = data[i]["fields"]["SoluImg1"];
          demoImg0Split = demoImg0.split(',')
          demoImg0Split0 = demoImg0Split[0]
          // var demoImg1 = data[i]["fields"]["SoluImg2"];
          // var demoImg2 = data[i]["fields"]["SoluImg3"];
          // var demoImg3 = data[i]["fields"]["SoluImg4"];
          // var demoImg4 = data[i]["fields"]["SoluImg5"];
          // var demoImg5 = data[i]["fields"]["SoluImg6"];

          // if (demoImg0 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg1"];
          // } else if (demoImg1 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg2"];
          // } else if (demoImg2 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg3"];
          // } else if (demoImg3 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg4"];
          // } else if (demoImg4 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg5"];
          // } else if (demoImg5 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg6"];
          // }
          var solutionIMG1Path =
            serverURL + "/static/solutionImg/" + userinfo.id + "/" + demoImg0Split0;
          console.log("soluType", i, ":", soluType);
          console.log("soluGdst", i, ":", soluGdst);
          console.log("soluDate", i, ":", soluDate);
          console.log("userEmail", i, ":", userEmail);

          if (userinfo.username == userEmail) {
            console.log("data :", data);
            html += '<li onclick="soldetailFn(' + i + ')">';
            html += '<div class="contArea">';
            html += '<div class="topCont">';
            html += '<img src="' + solutionIMG1Path + '" alt="">';
            html += "</div>";
            html += '<div class="btmCont">';
            html += '<div class="txtArea">';
            html += "<p>건물종류<span>" + soluType + "</span></p>";
            html += "<p>사용GDST<span>" + soluGdst + "</span></p>";
            html += "<p>신청일<span>" + formatDate1(soluDate) + "</span></p>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</li>";
          } else {
            null;
          }
        }
      }
      $(".solutioningPage .solutioning ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function soldetailFn(value) {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/solutiondetailpage.html", function (data) {
      $(_this).append(data);
    });
  });

  $.ajax({
    url: serverURL + "/SolutionIng/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var html1 = "";
      var data = JSON.parse(result.SolutionIngInfo);
      var soluType = data[value]["fields"]["buildingType"];
      var soluGdst = data[value]["fields"]["paidGDST"];
      var soluDate = data[value]["fields"]["soluRegisDate"];


      // var soluImg1 = data[value]["fields"]["SoluImg1"];
      // var soluImg2 = data[value]["fields"]["SoluImg2"];
      // var soluImg3 = data[value]["fields"]["SoluImg3"];
      // var soluImg4 = data[value]["fields"]["SoluImg4"];
      // var soluImg5 = data[value]["fields"]["SoluImg5"];
      // var soluImg6 = data[value]["fields"]["SoluImg6"];
      var imgList = data[value]["fields"]["SoluImg1"].split(',');
      // var imgList = [];
      // if (soluImg1) {
      //   imgList.push(soluImg1);
      // }
      // if (soluImg2) {
      //   imgList.push(soluImg2);
      // }
      // if (soluImg3) {
      //   imgList.push(soluImg3);
      // }
      // if (soluImg4) {
      //   imgList.push(soluImg4);
      // }
      // if (soluImg5) {
      //   imgList.push(soluImg5);
      // }
      // if (soluImg6) {
      //   imgList.push(soluImg6);
      // }
      console.log("imgList", imgList);

      for (i = 0; i < imgList.length; i++) {
        var imgPath =
          serverURL + "/static/solutionImg/" + userinfo.id + "/" + imgList[i];
        html1 += "<li>";
        html1 += '<span class="frame"><img src="' + imgPath + '"></span>';
        html1 += "</li>";
      }

      html += '<ul class="clearfix">';
      html += "<li>";
      html += "<p>신청일</p>";
      html += "</li>";
      html += "<li>";
      html += "<p>건물종류</p>";
      html += "</li>";
      html += "<li>";
      html += "<p>사용GDST</p>";
      html += "</li>";
      html += "</ul>";
      html += '<ul class="clearfix">';
      html += "<li>";
      html += "<span>" + formatDate1(soluDate) + "</span>";
      html += "</li>";
      html += "<li>";
      html += "<span>" + soluType + "</span>";
      html += "</li>";
      html += "<li>";
      html += "<span>" + soluGdst + "</span>";
      html += "</li>";
      html += "</ul>";

      $(".solutiondetailpage .solutiondetail .txtArea").html(html);
      $(".solutiondetailpage .solutiondetail .topCont #touchSlider1 ul").html(
        html1
      );
      $("#touchSlider1").touchSlider({
        controls: false,
        paging: false,
        initComplete: function (e) {
          var _this = this;
          var paging = "";
          var len = Math.ceil(this._len / this._view);

          for (var i = 1; i <= len; i++) {
            paging +=
              '<button type="button" class="page">page' + i + "</button>";
          }

          $(this)
            .next()
            .find(".paging")
            .html(paging)
            .find(".page")
            .on("click", function (e) {
              _this.go_page($(this).index());
            });
        },
        counter: function (e) {
          $(this)
            .next()
            .find(".page")
            .removeClass("on")
            .eq(e.current - 1)
            .addClass("on");
          $(this)
            .next()
            .find(".slider-count")
            .html(e.current + "&nbsp/&nbsp" + e.total);
        },
        autoplay: {
          enable: false,
          pauseHover: true,
          addHoverTarget: "", // 다른 오버영역 추가 ex) '.someBtn, .someContainer'
          interval: 3500,
        },
      });
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function mysolutionFn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/mysolutionPage.html", function (data) {
      $(_this).append(data);
    });
  });

  $.ajax({
    url: serverURL + "/MySolution/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var data = JSON.parse(result.mySolutionInfo);
      var data2 = JSON.parse(result.mySolutionInfo2);
      console.log(data);

      if (data2 == 0) {
        html += '<li class="nodata">';
        html += '<span class="frame"><img src="img/nodata1.png" alt=""></span>';
        html += "<p>요청 내역이 없습니다.</p>";
        html += "</li>";
      } else {
        for (i = 0; i < data.length; i++) {
          var soluStatus = data[i]["fields"]["soluStatus"];
          var soluType = data[i]["fields"]["buildingType"];
          var soluGdst = data[i]["fields"]["paidGDST"];
          var soluDate = data[i]["fields"]["soluRegisDate"];
          var userEmail = data[i]["fields"]["userEmail"];
          var demoImg0 = data[i]["fields"]["SoluImg1"];
          demoImg0Split = demoImg0.split(',')
          demoImg0Split0 = demoImg0Split[0]
          // var demoImg1 = data[i]["fields"]["SoluImg2"];
          // var demoImg2 = data[i]["fields"]["SoluImg3"];
          // var demoImg3 = data[i]["fields"]["SoluImg4"];
          // var demoImg4 = data[i]["fields"]["SoluImg5"];
          // var demoImg5 = data[i]["fields"]["SoluImg6"];
          // if (demoImg0 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg1"];
          // } else if (demoImg1 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg2"];
          // } else if (demoImg2 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg3"];
          // } else if (demoImg3 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg4"];
          // } else if (demoImg4 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg5"];
          // } else if (demoImg5 != "") {
          //   var SoluImg1 = data[i]["fields"]["SoluImg6"];
          // }
          var solutionIMG1Path =
            serverURL + "/static/solutionImg/" + userinfo.id + "/" + demoImg0Split0;
          console.log("soluType", i, ":", soluType);
          console.log("soluGdst", i, ":", soluGdst);
          console.log("soluDate", i, ":", soluDate);
          console.log("userEmail", i, ":", userEmail);

          if (userinfo.username == userEmail) {
            html += '<li onclick="mysoldetailFn(' + i + ')">';
            html += '<div class="contArea">';
            html += '<div class="topCont">';
            html += '<img src="' + solutionIMG1Path + '" alt="">';
            html += "</div>";
            html += '<div class="btmCont">';
            html += '<div class="txtArea">';
            html += "<p>건물종류<span>" + soluType + "</span></p>";
            html += "<p>사용GDST<span>" + soluGdst + "</span></p>";
            html += "<p>신청일<span>" + formatDate1(soluDate) + "</span></p>";
            html += "</div>";
            html += "</div>";
            html += "</div>";
            html += "</li>";
          } else {
            null;
          }
        }
      }
      $(".mysolutionPage .mysolutioning ul").html(html);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function mysoldetailFn(value) {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/mysolutiondetailpage.html", function (data) {
      $(_this).append(data);
    });
  });

  $.ajax({
    url: serverURL + "/MySolution/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var html = "";
      var html1 = "";
      var data = JSON.parse(result.mySolutionInfo);
      var soluType = data[value]["fields"]["buildingType"];
      var soluGdst = data[value]["fields"]["paidGDST"];
      var soluDate = data[value]["fields"]["soluRegisDate"];
      var answer = data[value]["fields"]["solutionAnswer"];
      var imgList = data[value]["fields"]["SoluImg1"].split(',');
      // var soluImg1 = data[value]["fields"]["SoluImg1"];
      // var soluImg2 = data[value]["fields"]["SoluImg2"];
      // var soluImg3 = data[value]["fields"]["SoluImg3"];
      // var soluImg4 = data[value]["fields"]["SoluImg4"];
      // var soluImg5 = data[value]["fields"]["SoluImg5"];
      // var soluImg6 = data[value]["fields"]["SoluImg6"];
      // var imgList = [];
      // if (soluImg1) {
      //   imgList.push(soluImg1);
      // }
      // if (soluImg2) {
      //   imgList.push(soluImg2);
      // }
      // if (soluImg3) {
      //   imgList.push(soluImg3);
      // }
      // if (soluImg4) {
      //   imgList.push(soluImg4);
      // }
      // if (soluImg5) {
      //   imgList.push(soluImg5);
      // }
      // if (soluImg6) {
      //   imgList.push(soluImg6);
      // }
      console.log("imgList", imgList);

      for (i = 0; i < imgList.length; i++) {
        var imgPath =
          serverURL + "/static/solutionImg/" + userinfo.id + "/" + imgList[i];
        html1 += "<li>";
        html1 += '<span class="frame"><img src="' + imgPath + '"></span>';
        html1 += "</li>";
      }
      html += '<div class="topCont">';
      html += '<div id="touchSlider2">';
      html += "<ul>";
      for (i = 0; i < imgList.length; i++) {
        var imgPath =
          serverURL + "/static/solutionImg/" + userinfo.id + "/" + imgList[i];
        html += "<li>";
        html += '<span class="frame"><img src="' + imgPath + '"></span>';
        html += "</li>";
      }
      html += "</ul>";
      html += "</div>";
      html += '<div class="slider-controls">';
      html += '<div class="slider-count"></div>';
      html += "</div>";
      html += "</div>";
      html += '<div class="txtArea">';
      html += '<ul class="clearfix">';
      html += "<li>";
      html += "<p>신청일</p>";
      html += " </li>";
      html += "<li>";
      html += "<p>건물종류</p>";
      html += " </li>";
      html += " <li>";
      html += " <p>사용GDST</p>";
      html += " </li>";
      html += " </ul>";
      html += ' <ul class="clearfix">';
      html += " <li>";
      html += "  <span>" + formatDate1(soluDate) + "</span>";
      html += " </li>";
      html += " <li>";
      html += " <span>" + soluType + "</span>";
      html += " </li>";
      html += " <li>";
      html += " <span>" + soluGdst + "</span>";
      html += " </li>";
      html += " </ul>";
      html += " </div>";
      html += ' <div class="solutionGuide">';
      html += ' <p class="tit">안전 솔루션 가이드</p>';
      html += ' <div class="guideCont">';
      html += ' <div class="gCont">';
      html += "<textarea readonly>" + answer + "</textarea>";
      html += "  </div>";
      html += "  </div>";
      html += "  </div>";

      $(".mysolutiondetailpage .mysolutiondetail").html(html);
      $("#touchSlider2").touchSlider({
        controls: false,
        paging: false,
        initComplete: function (e) {
          var _this = this;
          var paging = "";
          var len = Math.ceil(this._len / this._view);

          for (var i = 1; i <= len; i++) {
            paging +=
              '<button type="button" class="page">page' + i + "</button>";
          }

          $(this)
            .next()
            .find(".paging")
            .html(paging)
            .find(".page")
            .on("click", function (e) {
              _this.go_page($(this).index());
            });
        },
        counter: function (e) {
          $(this)
            .next()
            .find(".page")
            .removeClass("on")
            .eq(e.current - 1)
            .addClass("on");
          $(this)
            .next()
            .find(".slider-count")
            .html(e.current + "&nbsp/&nbsp" + e.total);
        },
        autoplay: {
          enable: false,
          pauseHover: true,
          addHoverTarget: "", // 다른 오버영역 추가 ex) '.someBtn, .someContainer'
          interval: 3500,
        },
      });
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function wait() {
  alertToast("준비중 입니다.");
}

function solution2Fn() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/solutionPage2.html", function (data) {
      $(_this).append(data);
      window.localStorage.removeItem('solutionImgList');
      // $.ajax({
      //   url: serverURL + "/solutionPageDel/",
      //   type: "POST",
      //   data: { userID: userinfo.id },
      //   dataType: "json",
      //   async: true,
      //   success: function (result) {
      //     console.log("imgCOunt", userinfo.ImgCount);


      //   },
      //   error: function (error) {
      //     $("#loading1").hide();
      //     console.log(error);
      //   },
      // });
    });
  });
}

function cameraSetOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    correctOrientation: true, //Corrects Android orientation quirks
  };
  return options;
}

function setOptions(srcType) {
  var options = {
    // Some common settings are 20, 50, and 100
    quality: 50,
    destinationType: Camera.DestinationType.FILE_URI,
    // In this app, dynamically set the picture source, Camera or photo gallery
    sourceType: srcType,
    encodingType: Camera.EncodingType.JPEG,
    mediaType: Camera.MediaType.PICTURE,
    allowEdit: false,
    correctOrientation: true, //Corrects Android orientation quirks
  };
  return options;
}

function solutionIMG1mnu() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
      $("#cameraTakePicture").attr("onclick", "solutionImgUp1Camera()");
      $("#cameraDel").attr("onclick", "solution1UpImgDel()");
      $("#cameraGetPicture").attr("onclick", "solutionImgUp1Photolibrary()");
    });
  });
}

function solutionImgUp1Camera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution1Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution1UpImgSuc,
        solution1UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solutionImgUp1Photolibrary() {
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution1Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution1UpImgSuc,
        solution1UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solution1UpImgSuc() {
  console.log("suc");
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var authorStatus = userinfo.authorStatus;
      var authorChangeCheck = userinfo.authorChangeCheck;
      var oneMoreCheck = userinfo.oneMoreCheck;
      var tempImg1 = userinfo.tempSoluImg1;
      var imgCount = userinfo.ImgCount;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
      var auctionIMG1TempPath =
        serverURL + "/static/solutionImg/" + userinfo.id + "/" + tempImg1;
      $(".solutionPage2 .solution .imgControl .mainImg #soluImg1").attr(
        "src",
        auctionIMG1TempPath
      );
      if (imgCount >= 2) {
        $(".solutionPage2 .solution .nexBtn a").attr("class", "on");
        $(".solutionPage2 .solution .nexBtn a").attr(
          "onclick",
          "savesolutionPop()"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function solution1UpImgFail() {
  $("#loading1").hide();
  console.log("err");
}

function solution1UpImgDel() {
  $(".camPop").remove();
  $.ajax({
    url: serverURL + "/solution1UpImgDel/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = result.userinfo;
      $("#soluImg1").attr("src", "img/imgBase.png");
      if (data < 2) {
        $(".solutionPage2 .solution .nexBtn a").removeClass("on");
        $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  userinfoUpdate();
  userinfoUpdate();
}

function solutionIMG2mnu() {
  console.log(2);
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
      $("#cameraTakePicture").attr("onclick", "solutionImgUp2Camera()");
      $("#cameraDel").attr("onclick", "solution2UpImgDel()");
      $("#cameraGetPicture").attr("onclick", "solutionImgUp2Photolibrary()");
    });
  });
}

function solutionImgUp2Camera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution2Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution2UpImgSuc,
        solution2UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solutionImgUp2Photolibrary() {
  console.log(2);
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution2Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution2UpImgSuc,
        solution2UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solution2UpImgSuc() {
  console.log(2);
  console.log("suc");
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var authorStatus = userinfo.authorStatus;
      var authorChangeCheck = userinfo.authorChangeCheck;
      var oneMoreCheck = userinfo.oneMoreCheck;
      var tempImg2 = userinfo.tempSoluImg2;
      var imgCount = userinfo.ImgCount;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
      var auctionIMG2TempPath =
        serverURL + "/static/solutionImg/" + userinfo.id + "/" + tempImg2;
      $(".solutionPage2 .solution .imgControl .mainImg #soluImg2").attr(
        "src",
        auctionIMG2TempPath
      );
      if (imgCount >= 2) {
        $(".solutionPage2 .solution .nexBtn a").attr("class", "on");
        $(".solutionPage2 .solution .nexBtn a").attr(
          "onclick",
          "savesolutionPop()"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function solution2UpImgFail() {
  $("#loading1").hide();
  console.log(2);
  console.log("err", err);
}

function solution2UpImgDel() {
  $(".camPop").remove();
  $.ajax({
    url: serverURL + "/solution2UpImgDel/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = result.userinfo;
      $("#soluImg2").attr("src", "img/imgBase.png");
      if (data < 2) {
        $(".solutionPage2 .solution .nexBtn a.on").removeClass("on");
        $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  userinfoUpdate();
  userinfoUpdate();
}

function solutionIMG3mnu() {
  console.log(3);
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
      $("#cameraTakePicture").attr("onclick", "solutionImgUp3Camera()");
      $("#cameraDel").attr("onclick", "solution3UpImgDel()");
      $("#cameraGetPicture").attr("onclick", "solutionImgUp3Photolibrary()");
    });
  });
}

function solutionImgUp3Camera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution3Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution3UpImgSuc,
        solution3UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solutionImgUp3Photolibrary() {
  console.log(3);
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution3Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution3UpImgSuc,
        solution3UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solution3UpImgSuc() {
  console.log(3);
  console.log("suc");
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var authorStatus = userinfo.authorStatus;
      var authorChangeCheck = userinfo.authorChangeCheck;
      var oneMoreCheck = userinfo.oneMoreCheck;
      var tempImg3 = userinfo.tempSoluImg3;
      var imgCount = userinfo.ImgCount;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
      var auctionIMG3TempPath =
        serverURL + "/static/solutionImg/" + userinfo.id + "/" + tempImg3;
      $(".solutionPage2 .solution .imgControl .mainImg #soluImg3").attr(
        "src",
        auctionIMG3TempPath
      );
      if (imgCount >= 2) {
        $(".solutionPage2 .solution .nexBtn a").attr("class", "on");
        $(".solutionPage2 .solution .nexBtn a").attr(
          "onclick",
          "savesolutionPop()"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function solution3UpImgFail() {
  $("#loading1").hide();
  console.log(3);
  console.log("err", err);
}

function solution3UpImgDel() {
  $(".camPop").remove();
  $.ajax({
    url: serverURL + "/solution3UpImgDel/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = result.userinfo;
      console.log("data", data);
      $("#soluImg3").attr("src", "img/imgBase.png");
      if (data < 2) {
        $(".solutionPage2 .solution .nexBtn a").removeClass("on");
        $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  userinfoUpdate();
  userinfoUpdate();
}

function solutionIMG4mnu() {
  console.log(4);
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
      $("#cameraTakePicture").attr("onclick", "solutionImgUp4Camera()");
      $("#cameraDel").attr("onclick", "solution4UpImgDel()");
      $("#cameraGetPicture").attr("onclick", "solutionImgUp4Photolibrary()");
    });
  });
}

function solutionImgUp4Camera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution4Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution4UpImgSuc,
        solution4UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solutionImgUp4Photolibrary() {
  console.log(4);
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution4Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution4UpImgSuc,
        solution4UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solution4UpImgSuc() {
  console.log(4);
  console.log("suc");
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var authorStatus = userinfo.authorStatus;
      var authorChangeCheck = userinfo.authorChangeCheck;
      var oneMoreCheck = userinfo.oneMoreCheck;
      var tempImg4 = userinfo.tempSoluImg4;
      var imgCount = userinfo.ImgCount;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
      var auctionIMG4TempPath =
        serverURL + "/static/solutionImg/" + userinfo.id + "/" + tempImg4;
      $(".solutionPage2 .solution .imgControl .mainImg #soluImg4").attr(
        "src",
        auctionIMG4TempPath
      );
      if (imgCount >= 2) {
        $(".solutionPage2 .solution .nexBtn a").attr("class", "on");
        $(".solutionPage2 .solution .nexBtn a").attr(
          "onclick",
          "savesolutionPop()"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function solution4UpImgFail() {
  $("#loading1").hide();
  console.log(4);
  console.log("err", err);
}

function solution4UpImgDel() {
  $(".camPop").remove();
  $.ajax({
    url: serverURL + "/solution4UpImgDel/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = result.userinfo;
      $("#soluImg4").attr("src", "img/imgBase.png");
      if (data < 2) {
        $(".solutionPage2 .solution .nexBtn a").removeClass("on");
        $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  userinfoUpdate();
  userinfoUpdate();
}

function solutionIMG5mnu() {
  console.log(5);
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
      $("#cameraTakePicture").attr("onclick", "solutionImgUp5Camera()");
      $("#cameraDel").attr("onclick", "solution5UpImgDel()");
      $("#cameraGetPicture").attr("onclick", "solutionImgUp5Photolibrary()");
    });
  });
}

function solutionImgUp5Camera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution5Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution5UpImgSuc,
        solution5UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solutionImgUp5Photolibrary() {
  console.log(5);
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution5Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution5UpImgSuc,
        solution5UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solution5UpImgSuc() {
  console.log(5);
  console.log("suc");
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var authorStatus = userinfo.authorStatus;
      var authorChangeCheck = userinfo.authorChangeCheck;
      var oneMoreCheck = userinfo.oneMoreCheck;
      var tempImg5 = userinfo.tempSoluImg5;
      var imgCount = userinfo.ImgCount;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
      var auctionIMG5TempPath =
        serverURL + "/static/solutionImg/" + userinfo.id + "/" + tempImg5;
      $(".solutionPage2 .solution .imgControl .mainImg #soluImg5").attr(
        "src",
        auctionIMG5TempPath
      );
      if (imgCount >= 2) {
        $(".solutionPage2 .solution .nexBtn a").attr("class", "on");
        $(".solutionPage2 .solution .nexBtn a").attr(
          "onclick",
          "savesolutionPop()"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function solution5UpImgFail() {
  $("#loading1").hide();
  console.log(5);
  console.log("err", err);
}

function solution5UpImgDel() {
  $(".camPop").remove();
  $.ajax({
    url: serverURL + "/solution5UpImgDel/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = result.userinfo;
      $("#soluImg5").attr("src", "img/imgBase.png");
      if (data < 2) {
        $(".solutionPage2 .solution .nexBtn a").removeClass("on");
        $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  userinfoUpdate();
  userinfoUpdate();
}

function solutionIMG6mnu() {
  console.log(6);
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/camPop.html", function (data) {
      $(_this).append(data);
      $("#cameraTakePicture").attr("onclick", "solutionImgUp6Camera()");
      $("#cameraDel").attr("onclick", "solution6UpImgDel()");
      $("#cameraGetPicture").attr("onclick", "solutionImgUp6Photolibrary()");
    });
  });
}

function solutionImgUp6Camera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution6Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution6UpImgSuc,
        solution6UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solutionImgUp6Photolibrary() {
  console.log(6);
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();

      options.fileName = mainTimestamp + ".jpeg";
      options.mimeType = "image/jpeg";

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solution6Upload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solution6UpImgSuc,
        solution6UpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}

function solution6UpImgSuc() {
  console.log(6);
  console.log("suc");
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      var authorStatus = userinfo.authorStatus;
      var authorChangeCheck = userinfo.authorChangeCheck;
      var oneMoreCheck = userinfo.oneMoreCheck;
      var tempImg6 = userinfo.tempSoluImg6;
      var imgCount = userinfo.ImgCount;

      console.log(
        "-------------------유저 정보 업데이트 완료-------------------"
      );
      var auctionIMG6TempPath =
        serverURL + "/static/solutionImg/" + userinfo.id + "/" + tempImg6;
      $(".solutionPage2 .solution .imgControl .mainImg #soluImg6").attr(
        "src",
        auctionIMG6TempPath
      );
      if (imgCount >= 2) {
        $(".solutionPage2 .solution .nexBtn a").attr("class", "on");
        $(".solutionPage2 .solution .nexBtn a").attr(
          "onclick",
          "savesolutionPop()"
        );
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function solution6UpImgFail() {
  $("#loading1").hide();
  console.log(6);
  console.log("err", err);
}

function solution6UpImgDel() {
  $(".camPop").remove();
  $.ajax({
    url: serverURL + "/solution6UpImgDel/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      var data = result.userinfo;
      $("#soluImg6").attr("src", "img/imgBase.png");
      if (data < 2) {
        $(".solutionPage2 .solution .nexBtn a").removeClass("on");
        $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
  userinfoUpdate();
  userinfoUpdate();
}

function exch2Fn() {
  console.log("환전 버튼");
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/exchPage2.html", function (data) {
      $(_this).append(data);
      var GDST = userinfo.GDSTamount;
      var GDSC = parseFloat(userinfo.GDSCamount);
      var tnum = Number($("#GDSCKRW1").html().replace(/,/g, "")) / 1200;
      console.log("tnumtnumtnum", tnum);
      html = "";
      html += '<div class="topCont">';
      html += '<span class="frame"><img src="img/logo.png" alt=""></span>';
      html +=
        '<input type="text" placeholder="사용 가능 수량: ' +
        GDSC.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        '" id="gdstCHgdsc" readonly/>';
      html += '<span class="frame1"><img src="img/exch.png" alt=""></span>';
      html += "</div>";
      html += '<div class="btmCont">';
      html += '<span class="frame"><img src="img/gdstlogo.png" alt=""></span>';
      if (tnum < 1) {
        html +=
          '<input type="text" id="gdscExchVal" placeholder="사용 가능 수량: ' +
          0 +
          ' " readonly/>';
      } else {
        html +=
          '<input type="text" id="gdscExchVal" placeholder="사용 가능 수량: ' +
          tnum.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
          ' " readonly/>';
      }
      html += "</div>";
      html += '<div class="clickNum">';
      html += '<ul class="clearfix">';
      html += "<li>";
      html += '<input type="hidden" value="1">';
      html += '<a href="#">1</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="2">';
      html += '<a href="#">2</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="3">';
      html += '<a href="#">3</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="4">';
      html += '<a href="#">4</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="5">';
      html += '<a href="#">5</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="6">';
      html += '<a href="#">6</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="7">';
      html += '<a href="#">7</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="8">';
      html += '<a href="#">8</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="9">';
      html += '<a href="#">9</a>';
      html += "</li>";
      html += "<li>";
      html += '<span class="blind">noneButton</span>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="0">';
      html += '<a href="#">0</a>';
      html += "</li>";
      html += "<li>";
      html += '<input type="hidden" value="">';
      html += '<a href="#"><img src="img/numdelete.png" alt=""></a>';
      html += "</li>";
      html += "</ul>";
      html += "</div>";
      html += '<div class="exchBtn">';
      html += '<a href="#" onclick="cTOt()">환전</a>';
      html += "</div>";
      $(".exchPage2 .exch").html(html);
      var inputNum = "";
      $(".exchPage2 .exch .clickNum ul li a").on("click", function () {
        var thisNum = $(this).siblings().val();
        if (thisNum == "") {
          inputNum = inputNum.slice(0, -1);
          console.log("inputNum: ", inputNum);
          $("#gdscExchVal").val(inputNum);
        } else {
          inputNum += thisNum;
          var waitinputNum = Number(inputNum);
          if (waitinputNum > tnum) {
            if (tnum < 1) {
              inputNum = 0;
            } else {
              inputNum = tnum.toFixed(0);
            }
            $("#gdscExchVal").val(
              inputNum.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          } else {
            $("#gdscExchVal").val(
              inputNum
                .replace(/(^0+)/, "")
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            );
          }
          console.log("tnum: ", tnum);
          console.log("waitinputNum: ", waitinputNum);
          console.log("inputNum: ", inputNum);
        }
        if (inputNum.replace(/(^0+)/, "") == "") {
          $("#gdstCHgdsc").val("");
        } else {
          var Ninputnum = (1200 / 
            gdscKRW()
          ) * Number(inputNum);
          $("#gdstCHgdsc").val(
            Ninputnum.toFixed(3)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          );
        }
      });
    });
  });
}

function cTOt() {
  if ($("#gdscExchVal").val() == "") {
    alertToast("환전 수량을 입력 해주세요");
  } else {
    $(".gdstCHhistoryPage").remove();
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/exchcompPage2.html", function (data) {
        $(_this).append(data);
        $.ajax({
          url: serverURL + "/CtoTsave/",
          type: "POST",
          data: {
            userPK: userinfo.id,
            gdsc: Number($("#gdstCHgdsc").val().replace(/,/g, "")),
            gdst: Number($("#gdscExchVal").val().replace(/,/g, "")),
            status: "2",
          },
          dataType: "json",
          async: true,
          success: function (result) {
            console.log("result.value: ", result.value);
          },
          error: function (error) {
            console.log(error);
          },
        });
      });
    });
  }
}

/* ----------------------------------------------------------------------------- */
function fofofofo() {
  $.ajax({
    url: serverURL + "/newsinfo/",
    type: "POST",
    dataType: "json",
    async: true,
    success: function (result) {
      var data = JSON.parse(result.SafeNewsinfo);
      var dataT = data[0]["fields"]["newsRegisDate"];
      var date1 = formatDate2(new Date());
      var date2 = formatDate2(dataT);

      console.log(date1);
      console.log(date2);

      if (date1 === date2) {
        console.log("날짝 같음");
      } else {
        console.log("날짜 다름");
      }
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function userinfoUpdate() {
  $.ajax({
    url: serverURL + "/updateUserinfo/",
    type: "POST",
    data: { userID: userinfo.id },
    dataType: "json",
    async: true,
    success: function (result) {
      window.localStorage.setItem("userinfo", JSON.stringify(result.user));
      userinfo = JSON.parse(window.localStorage.getItem("userinfo"));
      console.log("유저 정보 업데이트: ", userinfo);
    },
    error: function (error) {
      $("#loading1").hide();
      console.log(error);
    },
  });
}

function call() {
  var cha = 0;
  var sdd = $("#datepick3").val();
  console.log("sdd: ", sdd);
  var edd = $("#datepick4").val();
  console.log("edd: ", edd);
  var ar1 = sdd.split(".");
  console.log("ar1: ", ar1);
  var ar2 = edd.split(".");
  console.log("ar2: ", ar2);
  var da1 = new Date(ar1[0], ar1[1], ar1[2]);
  console.log("da1: ", da1);
  var da2 = new Date(ar2[0], ar2[1], ar2[2]);
  console.log("da2: ", da2);
  var dif = da2 - da1;
  console.log("dif: ", dif);
  var cDay = 24 * 60 * 60 * 1000; // 시 * 분 * 초 * 밀리세컨
  console.log("cDay: ", cDay);
  var cMonth = cDay * 30; // 월 만듬
  console.log("cMonth: ", cMonth);
  var cYear = cMonth * 12; // 년 만듬
  console.log("cYear: ", cYear);
  if (sdd && edd) {
    cha = parseInt(dif / cMonth);
    console.log("cha: ", cha);
    console.log(parseInt(dif / cYear));
    console.log(parseInt(dif / cMonth));
    console.log(parseInt(dif / cDay));
  }
  return cha;
}

function testestestset() {
  if (window.FirebasePlugin && typeof window.FirebasePlugin.getToken === "function") {
    window.FirebasePlugin.getToken(function (token) {
      // save this server-side and use it to push notifications to this device
      console.log("Firebase Token:", token);
    }, function(error) {
      console.error("Error getting token:", error);
    });
  } else {
    console.warn("FirebasePlugin or getToken function is not available. Skipping token retrieval.");
  }
}


// --------------------------------------------------------------------------------------------------------
// 2022.07.19 JS - 솔루션 이미지 수정된 기능 작업

function solutionIMGmnu() {
  var lilength = $('.solutionPage2 .solution .imgControl .imglistArea ul').children().length
  if(lilength >= 15) {
    alertToast("더이상 이미지를 등록할 수 없습니다.")
  } else {
    $(".changeSections").each(function () {
      var _this = this;
      $.get("./templates/camPop.html", function (data) {
        $(_this).append(data);
        $("#cameraTakePicture").attr("onclick", "solutionImgUpCamera()");
        $("#cameraDel").attr("onclick", "solutionUpImgDel()");
        $("#cameraGetPicture").attr("onclick", "solutionImgUpPhotolibrary()");
      });
    });
  }

}


function solutionImgUpCamera() {
  $(".camPop").remove();
  var srcType = Camera.PictureSourceType.CAMERA;
  var pictureoptions = cameraSetOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function userOnSuccess(imageUri) {
      $("#loading1").show();
      // Do something
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();
      var fileName = mainTimestamp + ".jpeg";
      options.fileName = fileName
      options.mimeType = "image/jpeg";


      var solutionImgList = JSON.parse(window.localStorage.getItem("solutionImgList"))
      console.log("solutionImgList >>>>", solutionImgList)
      if(solutionImgList == undefined || solutionImgList == "" || solutionImgList == null) {
        window.localStorage.setItem("solutionImgList", JSON.stringify([fileName]));
      } else {
        solutionImgList.push(fileName)
        console.log("fileList >>>>>", solutionImgList)
        window.localStorage.setItem("solutionImgList", JSON.stringify(solutionImgList));
      }
      

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solutionUpload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solutionUpImgSuc,
        solutionUpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function userOnFail(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}


function solutionImgUpPhotolibrary() {
  $(".camPop").remove();
  devicePlatform = device.platform;

  var srcType = Camera.PictureSourceType.PHOTOLIBRARY;
  var pictureoptions = setOptions(srcType);
  // var func = createNewFileEntry;

  navigator.camera.getPicture(
    function cameraSuccess(imageUri) {
      $("#loading1").show();
      console.log("imageUri:", imageUri);
      var options = new FileUploadOptions();
      options.fileKey = "file";
      var mainTimestamp = +new Date();
      var fileName = mainTimestamp + ".jpeg";

      options.fileName = fileName
      options.mimeType = "image/jpeg";

      var solutionImgList = JSON.parse(window.localStorage.getItem("solutionImgList"))
      console.log("solutionImgList >>>>", solutionImgList)
      if(solutionImgList == undefined || solutionImgList == "" || solutionImgList == null) {
        window.localStorage.setItem("solutionImgList", JSON.stringify([fileName]));
      } else {
        solutionImgList.push(fileName)
        console.log("fileList >>>>>", solutionImgList)
        window.localStorage.setItem("solutionImgList", JSON.stringify(solutionImgList));
      }

      var params = {};
      params.value1 = userinfo.id;
      options.params = params;
      options.chunkedMode = false;

      var ft = new FileTransfer();
      var savePath = serverURL + "/solutionUpload/";
      ft.upload(
        imageUri,
        encodeURI(savePath),
        solutionUpImgSuc,
        solutionUpImgFail,
        options
      );
      $("#loading1").hide();
    },
    function cameraError(error) {
      console.debug("Unable to obtain picture: " + error, "app");
    },
    pictureoptions
  );
}




function solutionUpImgSuc(res) {
  var day = JSON.parse(res.response)['day']
  var solutionImgList = JSON.parse(window.localStorage.getItem("solutionImgList"))
  var solutionImgListLen = solutionImgList.length;
  console.log("solutionImgList >>>>>", solutionImgList)
  var html = ""
  for(i=0; i<solutionImgListLen; i++) {
    var imgPath = serverURL + "/static/solutionImg/" + userinfo.id + "/" + day + "/" + solutionImgList[i];
    html += '<li imgliCount=\''+i+'\'>'
    html += '<div class="imgCont">'
    html += '<span class="frame"><img src='+imgPath+' alt=""></span>'
    html += '<a href="#" class="clseBtn" onclick="solutionUpImgDel(\''+i+'\', \''+solutionImgList[i]+'\')"><span class="clseframe"><img src="img/imgclse.png" alt=""></span></a>'
    html += '</div>'
    html += '</li>'
  }
  $('.solutionPage2 .solution .imgControl .imglistArea ul').html(html)
  if(solutionImgListLen >= 2) {
    $(".solutionPage2 .nexBtn a").attr("class", "on");
    $(".solutionPage2 .nexBtn a").attr("onclick","savesolutionPop()");
  }

  var lilength = $('.solutionPage2 .solution .imgControl .imglistArea ul').children().length
  $('.solutionPage2 .solution .txtbox .tit4 .nowNum em').text(lilength)
}

function solutionUpImgFail() {
  $("#loading1").hide();
  console.log("err");
}



function solutionUpImgDel(fileCount, fileName) {
  console.log("fileName >>>>>", fileCount)
  var solutionImgList = JSON.parse(window.localStorage.getItem("solutionImgList"))
  var solutionImgListLen = solutionImgList.length;
  console.log("solutionImgList >>>>>", solutionImgList)
  var html = ""
  for(i=0; i<solutionImgListLen; i++) {
    if(fileName == solutionImgList[i]) {
      console.log('i >>>>>', i)
      console.log("solutionImgList[i] >>>>", solutionImgList[i])  
      console.log("i-1 >>>>", i-1)
      if(i-1 == -1) {
        solutionImgList.shift();
      } else {
        solutionImgList.splice(i, 1)
      }
    }
  }
  window.localStorage.setItem("solutionImgList", JSON.stringify(solutionImgList));


  $('.solutionPage2 .solution .imgControl .imglistArea ul li').each(function(index, item) {
    var imgliCount = $(item).attr('imgliCount')
    if(imgliCount == fileCount) {
      $(item).remove()
    }
  })

  var solutionImgListCheck = JSON.parse(window.localStorage.getItem("solutionImgList"))
  var solutionImgListCheckLen = solutionImgListCheck.length;
  if(solutionImgListCheckLen < 2) {
    $(".solutionPage2 .nexBtn a").removeAttr("class");
    $(".solutionPage2 .nexBtn a").removeAttr("onclick")
  }

  var lilength = $('.solutionPage2 .solution .imgControl .imglistArea ul').children().length
  $('.solutionPage2 .solution .txtbox .tit4 .nowNum em').text(lilength)

  // $(".camPop").remove();
  // $.ajax({
  //   url: serverURL + "/solution1UpImgDel/",
  //   type: "POST",
  //   data: { userID: userinfo.id },
  //   dataType: "json",
  //   async: true,
  //   success: function (result) {
  //     var data = result.userinfo;
  //     $("#soluImg1").attr("src", "img/imgBase.png");
  //     if (data < 2) {
  //       $(".solutionPage2 .solution .nexBtn a").removeClass("on");
  //       $(".solutionPage2 .solution .nexBtn a").attr("onclick", "");
  //     }
  //   },
  //   error: function (error) {
  //     $("#loading1").hide();
  //     console.log(error);
  //   },
  // });
  // userinfoUpdate();
  // userinfoUpdate();
}


// ---------------------------------------------------------------------------------------------
// 2022.07.20 JS 스테이킹 작업
function staking() {
  $(".changeSections").each(function () {
    var _this = this;
    $.get("./templates/stakinghisPage.html", function (data) {
      $(_this).append(data);

    });
  });
}