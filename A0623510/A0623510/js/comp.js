myView.controller("popupcompCtrl", [
  "$scope",
  "$rootScope",
  "appService",
  "$sce",
  function (e, a, o, r) {
    (e.state = {}), (e.popupOn = !1), (e.autoClose = 0);
    var i,
      n = !1;
    (e.fetchComponentData = function (e) {
      i = o.getConfigData().data[e];
    }),
      (e.initComp = function (a) {
        (e.state = i[e.contentid]),
          (e.hideHeader = e.state.hideHeader || !1),
          (e.type = e.state.type),
          (e.headerText = e.state.headerText || ""),
          (e.textContent = r.trustAsHtml(e.state.textContent) || ""),
          (e.imageCaption = e.state.imageCaption || ""),
          e.dynamicpopuptext && (e.textContent = e.dynamicpopuptext),
          (e.imagePath = e.state.imagePath),
          (e.imageHeight = e.state.imageHeight || 100),
          (e.imageWidth = e.state.imageWidth || 150),
          (e.audioPath = e.state.audioPath || ""),
          (e.hideClose = e.state.hideClose || !1),
          (e.containerDiv = e.state.container || ""),
          (e.confirmBtns = e.state.confirmBtns || !1),
          (e.okTxt = e.state.okTxt || "ok"),
          (e.cancelTxt = e.state.cancelTxt || "cancel"),
          e.state.autoClose
            ? (e.autoClose = 1e3 * e.state.autoClose)
            : (e.autoClose = 0);
      }),
      (e.closePopup = function (a) {
        (e.popupOn = !1), e.$emit("popupClosed", e.contentid);
      }),
      (e.closeBtnClick = function () {
        1 != n && e.closePopup();
      }),
      (e.cancelClick = function () {
        1 != n && e.closePopup();
      }),
      (e.okClick = function () {
        e.contentid.indexOf("_") &&
          ((e.contentid = e.contentid.split("_")),
          (e.contentid = e.contentid[0])),
          1 != n && ((e.popupOn = !1), e.$emit("popupConfirm", e.contentid));
      }),
      e.$on("closePopup", function (a) {
        e.popupOn = !1;
      }),
      e.$on("showPopup", function (a, o, r) {
        if (!o || !i[o])
          return void console.warn(
            "Popup data not found. Check JSON. Type --- ",
            o
          );
        (e.contentid = o),
          r && (e.dynamicpopuptext = r),
          e.initComp(),
          (e.popupOn = !0),
          1 == e.popupOn &&
            e.autoClose > 0 &&
            $timeout(function (a) {
              e.closePopup();
            }, e.autoClose),
          e.containerDiv && $(".popupParent").appendTo(e.containerDiv);
      }),
      e.$on("togglepopup", function (a, o, r) {
        if (!o || !i[o])
          return void console.warn(
            "Popup data not found. Check JSON. Type --- ",
            o
          );
        (e.contentid = o),
          r && (e.dynamicpopuptext = r),
          e.initComp(),
          (e.popupOn = !e.popupOn),
          1 == e.popupOn &&
            e.autoClose > 0 &&
            $timeout(function (a) {
              e.closePopup();
            }, e.autoClose),
          e.containerDiv && $(".popupParent").appendTo(e.containerDiv);
      }),
      e.$on("disablePopupClicks", function () {
        n = !0;
      }),
      e.$on("enablePopupClicks", function () {
        n = !1;
      });
  },
]),
  myView.directive("popupcompDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      scope: {},
      controller: "popupcompCtrl",
      templateUrl: "templates/popupcompTemplate.html",
      link: function (e, a, o) {
        o.id
          ? (e.fetchComponentData(o.id), (e.compId = o.id))
          : console.log("Provide id and json to component");
      },
    };
  }),
  myView.controller("audioplayerCtrl", [
    "$scope",
    "$rootScope",
    "appService",
    "$timeout",
    function (e, a, o, r) {
      (e.state = null),
        (e.lang = "en"),
        (e.audioType = "audio/mp3"),
        (e.audioSrc = null),
        (e.active = !0),
        (e.playingState = !1),
        (e.pauseState = !1),
        (e.replyState = !1),
        (e.source = ""),
        (e.sourceArr = []),
        (e.sourceIndex = 0),
        (e.endCallback = null),
        (e.fetchComponentData = function (a) {
          (e.state = o.getConfigData().data[a]),
            (e.lang = o.getConfigData().language || "en");
          var r = o.getConfigData().type || "mp3";
          (e.audioType = "audio/" + r),
            (e.source = e.state.default ? e.state.default : ""),
            e.preCacheAudio();
        }),
        (e.preCacheAudio = function () {
          function a() {}
          for (var o in e.state)
            e.state[o][e.lang] &&
              (function (e) {
                var o = new Audio();
                o.addEventListener("canplaythrough", a, !1), (o.src = e);
              })(e.state[o][e.lang]);
        }),
        (e.initComp = function () {}),
        (e.playAudio = function () {
          e.stopAudio(),
            (e.audioControl.src = e.source),
            e.audioControl &&
              ((e.playingState = !0),
              (e.pauseState = !1),
              (e.replyState = !0),
              (e.active = !1),
              e.audioControl.play(),
              e.audioControl.paused && e.audioEndHandler(),
              e.$emit("audioStarted", e.audioSrc, e.endCallback));
        }),
        (e.pauseAudio = function () {
          e.audioControl.pause(),
            (e.playingState = !1),
            (e.pauseState = !0),
            (e.replyState = !0);
        }),
        (e.replayAudio = function () {
          e.playAudio();
        }),
        (e.stopAudio = function () {
          e.audioControl &&
            (e.audioControl.pause(),
            (e.playingState = !1),
            (e.pauseState = !1),
            (e.replyState = !1),
            (e.active = !0),
            (e.audioControl.src = ""),
            e.$emit("audioStop", e.audioSrc));
        }),
        e.$on("playAudio", function (a, o, r) {
          e.active && e.triggerAudio(o, r);
        }),
        (e.triggerAudio = function (a, o) {
          e.state && e.state[a]
            ? ((e.audioSrc = a), (e.source = e.state[e.audioSrc][e.lang]))
            : ((e.audioSrc = a), (e.source = a)),
            (e.endCallback = o || null),
            e.playAudio();
        }),
        e.$on("pauseAudio", function (a, o) {
          e.pauseAudio();
        }),
        e.$on("replayAudio", function (a, o) {
          e.replayAudio();
        }),
        e.$on("stopAudio", function () {
          (e.sourceArr = []), e.stopAudio();
        }),
        e.$on("playAudioArray", function (a, o, r) {
          if (e.active) {
            (e.sourceArr = o), (e.sourceIndex = 0), (e.arrCallback = r);
            var i = e.arrCallback;
            i && i.arrIndex >= 0 && e.sourceIndex != i.arrIndex && (i = null),
              e.triggerAudio(e.sourceArr[e.sourceIndex], i);
          }
        });
    },
  ]),
  myView.directive("audioplayerDirective", function () {
    return {
      retrict: "EA",
      replace: !0,
      scope: {},
      controller: "audioplayerCtrl",
      templateUrl: "templates/audioplayerTemplate.html",
      link: function (e, a, o) {
        o.id
          ? (e.fetchComponentData(o.id),
            (e.compId = o.id),
            (e.audioControl = a.find("#audioTag")[0]),
            e.$watch("source", function () {}),
            a.ready(function () {
              e.initComp();
            }),
            e.audioControl.addEventListener(
              "timeupdate",
              function (a) {
                var o = e.audioControl.currentTime.toFixed(1);
                o = parseFloat(o);
                var r = e.audioControl.duration.toFixed(2);
                (r = parseFloat(r)),
                  o >= r &&
                    ((e.playingState = !1),
                    (e.pauseState = !1),
                    (e.replyState = !1),
                    e.$apply());
              },
              !1
            ),
            e.audioControl.addEventListener("ended", function (a) {
              e.audioEndHandler();
            }),
            e.audioControl.addEventListener("error", function (a) {
              "" != $(a.target).attr("src") && e.audioEndHandler();
            }),
            (e.audioEndHandler = function () {
              if (
                ((e.playingState = !1),
                (e.pauseState = !1),
                (e.replyState = !1),
                (e.active = !0),
                (e.audioControl.src = ""),
                e.$emit("audioEnd", e.audioSrc, e.endCallback),
                e.sourceArr.length >= 0 && e.sourceIndex++,
                e.$apply(),
                e.sourceIndex < e.sourceArr.length)
              ) {
                var a = e.arrCallback;
                a &&
                  a.arrIndex >= 0 &&
                  e.sourceIndex != a.arrIndex &&
                  (a = null),
                  e.triggerAudio(e.sourceArr[e.sourceIndex], a);
              }
              e.sourceIndex >= e.sourceArr.length && (e.sourceArr = []);
            }))
          : console.log("Provide id and json to component");
      },
    };
  }),
  myView.controller("closecaptionsCtrl", [
    "$scope",
    "$rootScope",
    "appService",
    "$timeout",
    function (e, a, o, r) {
      (e.state = {}),
        (e.showCaption = !1),
        (e.captionText = ""),
        (e.lang = "en"),
        (e.fetchComponentData = function (a) {
          (e.state = o.getConfigData().data[a]),
            (e.lang = o.getConfigData().language || "en");
        }),
        (e.initComp = function () {}),
        e.$on("showCaption", function (a, o, r) {
          e.state && e.state[o] && (e.captionText = e.state[o][e.lang]),
            r && (e.captionText = e.captionText + r),
            "" != e.captionText && (e.showCaption = !0);
        }),
        e.$on("hideCaption", function (a, o, i) {
          e.showCaption &&
            (i
              ? r(function () {
                  (e.captionText = ""), (e.showCaption = !1);
                }, i)
              : ((e.captionText = ""), (e.showCaption = !1)));
        });
    },
  ]),
  myView.directive("closecaptionsDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      scope: !0,
      controller: "closecaptionsCtrl",
      templateUrl: "templates/closecaptionsTemplate.html",
      link: function (e, a, o) {
        o.id
          ? (e.fetchComponentData(o.id),
            (e.compId = o.id),
            a.ready(function () {
              e.initComp();
            }))
          : console.log("Provide id and json to component");
      },
    };
  }),
  myView.controller("dndcompCtrl", [
    "$scope",
    "appService",
    "APPCONSTANT",
    "$timeout",
    function (e, a, o, r) {
      var i = {},
        n = {},
        t = {},
        l = {},
        s = 10,
        c = 1,
        m = !1;
      e.$on(o.ACTIVITY_LOADED, function () {
        e.state &&
          e.state.scaleFix &&
          e.tabIndex == e.state.tabIndex &&
          ((m = !0),
          (c =
            $(e.state.scaleFix.parent).height() /
            $(e.state.scaleFix.content).height()),
          ($.ui.ddmanager.prepareOffsets = function (e, a) {
            var o,
              r,
              i = $.ui.ddmanager.droppables[e.options.scope] || [],
              n = a ? a.type : null,
              t = (e.currentItem || e.element)
                .find(":data(ui-droppable)")
                .addBack();
            e: for (o = 0; o < i.length; o++)
              if (
                !(
                  i[o].options.disabled ||
                  (e &&
                    !i[o].accept.call(
                      i[o].element[0],
                      e.currentItem || e.element
                    ))
                )
              ) {
                for (r = 0; r < t.length; r++)
                  if (t[r] === i[o].element[0]) {
                    i[o].proportions().height = 0;
                    continue e;
                  }
                (i[o].visible = "none" !== i[o].element.css("display")),
                  i[o].visible &&
                    ("mousedown" === n && i[o]._activate.call(i[o], a),
                    (i[o].offset = i[o].element.offset()),
                    i[o].proportions({
                      width: i[o].element[0].offsetWidth * c,
                      height: i[o].element[0].offsetHeight * c,
                    }));
              }
          }));
      }),
        (e.fetchComponentData = function (o) {
          e.state = a.getConfigData().data[o];
        }),
        (e.initDnD = function (a) {
          var o = { dndcompJson: e.state };
          e.$emit("DnDInitialized", o);
        }),
        (e.registerDragItems = function (e, a) {
          var o = {};
          (o.id = e[0].id),
            (o.pos = {}),
            (o.pos.left = e[0].getBoundingClientRect().left),
            (o.pos.top = e[0].getBoundingClientRect().top),
            (i[e[0].id] = o);
        }),
        (e.registerDropTargets = function (e, a) {
          var o = {};
          (o.id = e[0].id),
            (o.pos = {}),
            (o.pos.left = e[0].getBoundingClientRect().left),
            (o.pos.top = e[0].getBoundingClientRect().top),
            (n[e[0].id] = o);
        }),
        (e.onItemDragStart = function (a, o, r) {
          m &&
            r &&
            r.containment &&
            ((o.position.left = 0),
            (o.position.top = 0),
            (t = {}),
            (t.width = $(r.containment).width()),
            (t.height = $(r.containment).height()),
            (l = {}),
            (l.width = $(a.target).outerWidth()),
            (l.height = $(a.target).outerHeight())),
            angular.element(a.target).css("z-index", s++);
          var i = { event: a, ui: o, optionObj: r };
          e.$emit("ItemDragStarted", i);
        }),
        (e.onItemDrag = function (a, o, r) {
          if (m && r && r.containment) {
            var i = c,
              n = o.position.left - o.originalPosition.left,
              s = o.originalPosition.left + n / i,
              d = o.position.top - o.originalPosition.top,
              p = o.originalPosition.top + d / i;
            (o.position.left = s),
              (o.position.top = p),
              o.position.left > t.width - l.width &&
                ((s = t.width - l.width), !0),
              s < 0 && ((s = 0), !0),
              o.position.top > t.height - l.height &&
                ((p = t.height - l.height), !0),
              p < 0 && ((p = 0), !0),
              (o.position.left = s),
              (o.position.top = p);
          }
          var u = { event: a, ui: o, optionObj: r };
          e.$emit("ItemDragging", u);
        }),
        (e.onItemDragStop = function (a, o, r) {
          var i = { event: a, ui: o, optionsObj: r };
          e.$emit("ItemDragStopped", i);
        }),
        (e.onItemDrop = function (a, o, r) {
          var i = { event: a, ui: o, optionsObj: r };
          $(o.draggable).hasClass("droppedItem")
            ? e.$emit("againDropped", i)
            : (e.$emit("ItemDropped", i),
              $(a.target)
                .find("[draggable-directive]")
                .addClass("droppedItem"));
        }),
        (e.onItemDragOver = function (a, o) {
          var r = { event: a, ui: o };
          e.$emit("ItemDraggedOver", r);
        }),
        (e.onItemDragOut = function (a, o) {
          var r = { event: a, ui: o };
          e.$emit("ItemDraggedOut", r);
        }),
        e.$on("initDragOnDrop", function (a, o) {
          if (e.state.dragAfterDrop) {
            var r = $(o.event.target).find("[draggable-directive]");
            o.isResizable &&
              (r = $(o.event.target).find("[draggable-directive]").parent()),
              $(o.event.target)
                .find("[draggable-directive]")
                .removeAttr("draggable-directive"),
              r.draggable(e.state.dragAfterDrop),
              r.draggable("option", {
                start: function (a, o) {
                  e.onItemDragStart(a, o, e.state.customDragOptionsDropped);
                },
                drag: function (a, o) {
                  e.onItemDrag(a, o, e.state.customDragOptionsDropped);
                },
                stop: function (a, o) {
                  e.onItemDragStop(a, o, e.state.customDragOptionsDropped);
                },
              });
          }
        }),
        e.$on("initResizeOnDrop", function (a, o) {
          if (e.state.resizeAfterDrop) {
            o.isResizable = !0;
            var r = $(o.event.target).find("[draggable-directive]");
            r.resizable(e.state.resizeAfterDrop),
              r.resizable("option", {
                start: function (a, o) {
                  e.onResizeStart(a, o);
                },
                resize: function (a, o) {
                  e.onResize(a, o);
                },
              });
          }
        }),
        (e.onResizeStart = function (e, a) {
          m && ((a.position.left = 0), (a.position.top = 0));
        }),
        (e.onResize = function (e, a) {
          if (m) {
            var o = a.size.width - a.originalSize.width,
              r = a.originalSize.width + o / percent,
              i = a.size.height - a.originalSize.height,
              n = a.originalSize.height + i / percent;
            (a.size.width = r), (a.size.height = n);
          }
        }),
        (e.reset = function () {
          s = 10;
          var a = { scope: e };
          e.$emit("DnDReset", a);
        }),
        e.$on("resetDnd", function () {
          e.reset();
        }),
        e.$on("toggleDnd", function (e, a) {
          1 == a.disable
            ? angular.element(a.elemRef).draggable("option", "disabled", !0)
            : angular.element(a.elemRef).draggable("option", "disabled", !1);
        });
    },
  ]),
  myView.directive("dndcompDirective", [
    function () {
      return {
        retrict: "A",
        controller: "dndcompCtrl",
        link: function (e, a, o) {
          o.id
            ? (e.fetchComponentData(o.id),
              (e.compId = o.id),
              a.ready(function () {
                e.initDnD(e.compId);
              }))
            : console.log("Provide id and json to component");
        },
      };
    },
  ]),
  myView.directive("draggableDirective", [
    function () {
      return {
        restrict: "A",
        link: function (e, a, o) {
          a.ready(function () {
            e.registerDragItems(a, o), a.draggable(e.state.dragOptions);
            var r = "original";
            (r =
              e.state.dragOptions && e.state.dragOptions.helper
                ? e.state.dragOptions.helper
                : e.state.customDragOptions && e.state.customDragOptions.helper
                ? e.state.customDragOptions.helper
                : e.state.customDragOptions &&
                  e.state.customDragOptions.containment
                ? function () {
                    return $(this)
                      .clone()
                      .appendTo(e.state.customDragOptions.containment)
                      .css("zIndex", 2)
                      .show();
                  }
                : "original"),
              a.draggable("option", {
                helper: r,
                start: function (a, o) {
                  e.onItemDragStart(a, o, e.state.customDragOptions);
                },
                drag: function (a, o) {
                  e.onItemDrag(a, o, e.state.customDragOptions);
                },
                stop: function (a, o) {
                  e.onItemDragStop(a, o, e.state.customDragOptions);
                },
              });
          });
        },
      };
    },
  ]),
  myView.directive("droppableDirective", [
    function () {
      return {
        restrict: "A",
        link: function (e, a, o) {
          a.ready(function () {
            e.registerDropTargets(a, o),
              a.droppable(e.state.dropOptions),
              a.droppable("option", {
                drop: function (a, o) {
                  e.onItemDrop(a, o, e.state.customDropOptions);
                },
                out: function (a, o) {
                  e.onItemDragOut(a, o, e.state.customDropOptions);
                },
                over: function (a, o) {
                  e.onItemDragOver(a, o, e.state.customDropOptions);
                },
              });
          });
        },
      };
    },
  ]),
  myView.controller("VideoPlayerCtrl", [
    "$scope",
    function (e) {
      function a(e) {
        var a = "0",
          o = "0",
          r = parseInt(e);
        if (r >= 60 && r < 3600) {
          var a = ("0" + Math.floor(r / 60)).slice(-2);
          r %= 60;
        }
        if (r < 60) var o = ("0" + Math.floor(r)).slice(-2);
        return a + ":" + o;
      }
      function o() {
        isNaN(i.duration)
          ? (e.percentage = 0)
          : ((i.volume = 0),
            (e.videoTime = a(i.currentTime)),
            (e.videoDuration = a(i.duration)),
            (e.percentage = Math.floor((100 / i.duration) * i.currentTime))),
          e.$apply();
      }
      (e.isEnablePlayBtn = !1),
        (e.showTaskbar = !0),
        (e.enable_AD_btn = !0),
        (e.enable_dropdown = !1),
        (e.setting_dropdown = !1),
        (e.speed_dropdown = !1),
        (e.enable_settingOption = !1),
        (e.is_fullscreen = !0),
        (e.percentage = 0),
        (e.videoTime = 0),
        (e.audio_volume = 3),
        (e.speeds = [0.5, 1, 1.25, 1.5, 2]),
        (e.myPopup = !0),
        (e.centre_playing = !0);
      var r = document.getElementsByClassName("slider"),
        i = "",
        n = "";
      (e.videoSrc = ""),
        document.addEventListener("fullscreenchange", function () {
          e.is_fullscreen = !e.is_fullscreen;
        }),
        (e.renderFunctions = function () {
          function r(e, a) {
            (e.style.height = a.scrollHeight + "px"),
              (e.style.width = a.scrollWidth + "px"),
              (e.style.display = "block");
          }
          function t(e, a) {
            e.style.display = "none";
          }
          (i = document.getElementById("video")),
            (n = document.getElementById("fullScreenBtn"));
          var l = document.getElementById("placeholder_1");
          (l.style.top = i.offsetTop + "px"),
            (l.style.left = i.offsetLeft + "px"),
            (i.onwaiting = function () {
              r(l, this);
            }),
            (i.onplaying = function () {
              t(l, this);
            }),
            -1 != navigator.userAgent.indexOf("iPhone") ||
            -1 != navigator.userAgent.indexOf("iPod") ||
            -1 != navigator.userAgent.indexOf("iPad")
              ? (n.style.display = "none")
              : (n.style.display = "block"),
            (e.videoTime = a(i.currentTime)),
            (e.videoDuration = a(i.duration)),
            (i.src = e.videoSrc),
            i.addEventListener("timeupdate", o, !1),
            i.addEventListener("loadedmetadata", function () {
              (e.videoDuration = a(i.duration)),
                0 == e.videoTime && (e.videoTime = "0.00"),
                e.$apply();
            });
        }),
        (e.toggle = function () {
          (e.myPopup = !e.myPopup),
            (e.playing = !1),
            i.pause(),
            (e.centre_playing = !0);
        }),
        (e.playing = !1),
        (e.ad = !0),
        (e.add = function () {
          e.ad = !1;
        }),
        (e.unadd = function () {
          e.ad = !0;
        }),
        (e.audio = !0),
        (e.mute = function () {
          (e.audio = !1), (i.muted = !0);
        }),
        (e.unmute = function () {
          (e.audio = !0), (i.muted = !1);
        }),
        (e.playVideo = function () {
          return (
            (e.centre_playing = !1),
            (e.playing = !0),
            i.play(),
            (i.onended = function (o) {
              $(".control-box").removeClass("mystyle"),
                (e.playing = !1),
                (e.centre_playing = !0),
                (e.videoTime = 0),
                (e.videoDuration = a(i.duration)),
                (e.videoTime = "0.00"),
                e.$apply();
            }),
            setTimeout(function () {
              $(".control-box").addClass("mystyle");
            }, 1e3),
            !1
          );
        }),
        (e.pauseVideo = function () {
          (e.playing = !1), i.pause(), console.log("paused");
        }),
        $("#video").hover(
          function () {
            $(".control-box").removeClass("mystyle");
          },
          function () {
            $(".control-box").addClass("mystyle");
          }
        ),
        (e.seek = function (o) {
          var n = o.offsetX / r[0].offsetWidth,
            t = n * i.duration;
          (i.currentTime = t),
            (e.percentage = Math.floor((100 / i.duration) * t)),
            (e.videoTime = a(i.currentTime));
        }),
        (e.setVolume = function () {
          0 == e.audio_volume
            ? (e.audio_volume = currVolume)
            : ((currVolume = e.audio_volume), (e.audio_volume = 0));
        }),
        (e.enable_AD = function () {
          e.enable_AD_btn = !e.enable_AD_btn;
        }),
        (e.settingBtn = function () {
          (e.enable_dropdown = !e.enable_dropdown),
            e.enable_dropdown
              ? (e.enable_settingOption = !0)
              : ((e.enable_settingOption = !1), (e.speed_dropdown = !1));
        }),
        (e.settingOption = function (a) {
          (e.enable_settingOption = !1),
            "speed" === a && (e.speed_dropdown = !0);
        }),
        (e.changeSpeed = function (a) {
          "setting" === a
            ? ((e.enable_settingOption = !0), (e.speed_dropdown = !1))
            : (i.playbackRate = a);
        }),
        e.$on("playVideo", function (a, o) {
          (e.videoSrc = o), e.renderFunctions(), (e.percentage = 0);
        }),
        e.$on("stopVideo", function (a, o) {
          (e.playing = !1), i && i.pause(), (e.centre_playing = !0);
        }),
        (e.fullScreen = function () {
          e.is_fullscreen
            ? i.requestFullscreen
              ? (i.requestFullscreen(), console.log(i.requestFullscreen()))
              : i.mozRequestFullScreen
              ? i.mozRequestFullScreen()
              : i.webkitRequestFullscreen
              ? i.webkitRequestFullscreen()
              : i.msRequestFullscreen && i.msRequestFullscreen()
            : document.exitFullscreen
            ? document.exitFullscreen()
            : document.webkitExitFullscreen
            ? document.webkitExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.msExitFullscreen && document.msExitFullscreen();
        });
    },
  ]),
  myView.directive("videoplayerDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      controller: "VideoPlayerCtrl",
      templateUrl: "templates/videoControl.html",
    };
  }),
  myView.controller("VideoPlayerIntroInstructionCtrl", [
    "$scope",
    function (e) {
      function a(e) {
        var a = "0",
          o = "0",
          r = parseInt(e);
        if (r >= 60 && r < 3600) {
          var a = ("0" + Math.floor(r / 60)).slice(-2);
          r %= 60;
        }
        if (r < 60) var o = ("0" + Math.floor(r)).slice(-2);
        return a + ":" + o;
      }
      function o() {
        isNaN(i.duration)
          ? (e.percentage = 0)
          : ((i.volume = 0),
            (e.videoTime = a(i.currentTime)),
            (e.videoDuration = a(i.duration)),
            (e.percentage = Math.floor((100 / i.duration) * i.currentTime))),
          e.$apply();
      }
      (e.isEnablePlayBtn = !1),
        (e.showTaskbar = !0),
        (e.enable_AD_btn = !0),
        (e.enable_dropdown = !1),
        (e.setting_dropdown = !1),
        (e.speed_dropdown = !1),
        (e.enable_settingOption = !1),
        (e.is_fullscreen = !0),
        (e.percentage = 0),
        (e.videoTime = 0),
        (e.audio_volume = 3),
        (e.speeds = [0.5, 1, 1.25, 1.5, 2]),
        (e.myPopup = !0),
        (e.centre_playing = !0);
      var r = document.getElementsByClassName("slider"),
        i = "",
        n = "";
      (e.videoSrc = ""),
        document.addEventListener("fullscreenchange", function () {
          e.is_fullscreen = !e.is_fullscreen;
        }),
        (e.renderFunctions2 = function () {
          function r(e, a) {
            (e.style.height = a.scrollHeight + "px"),
              (e.style.width = a.scrollWidth + "px"),
              (e.style.display = "block");
          }
          function t(e, a) {
            e.style.display = "none";
          }
          (i = document.getElementById("videoIntroInstruction")),
            (n = document.getElementById("fullScreenBtn"));
          var l = document.getElementById("placeholder_1");
          (l.style.top = i.offsetTop + "px"),
            (l.style.left = i.offsetLeft + "px"),
            (i.onwaiting = function () {
              r(l, this);
            }),
            (i.onplaying = function () {
              t(l, this);
            }),
            -1 != navigator.userAgent.indexOf("iPhone") ||
            -1 != navigator.userAgent.indexOf("iPod") ||
            -1 != navigator.userAgent.indexOf("iPad")
              ? (n.style.display = "none")
              : (n.style.display = "block"),
            (e.videoTime = a(i.currentTime)),
            (e.videoDuration = a(i.duration)),
            (i.src = e.videoSrc),
            i.addEventListener("timeupdate", o, !1),
            i.addEventListener("loadedmetadata", function () {
              (e.videoDuration = a(i.duration)),
                0 == e.videoTime && (e.videoTime = "0.00"),
                e.$apply();
            });
        }),
        (e.toggle = function () {
          (e.myPopup = !e.myPopup),
            (e.playing = !1),
            i.pause(),
            (e.centre_playing = !0);
        }),
        (e.playing = !1),
        (e.ad = !0),
        (e.add = function () {
          e.ad = !1;
        }),
        (e.unadd = function () {
          e.ad = !0;
        }),
        (e.audio = !0),
        (e.mute = function () {
          (e.audio = !1), (i.muted = !0);
        }),
        (e.unmute = function () {
          (e.audio = !0), (i.muted = !1);
        }),
        (e.playIntroInstructionVideo = function () {
          return (
            (e.centre_playing = !1),
            (e.playing = !0),
            i.play(),
            (i.onended = function (o) {
              $(".control-box").removeClass("mystyle"),
                (e.playing = !1),
                (e.centre_playing = !0),
                (e.videoTime = 0),
                (e.videoDuration = a(i.duration)),
                (e.videoTime = "0.00"),
                e.$apply();
            }),
            setTimeout(function () {
              $(".control-box").addClass("mystyle");
            }, 1e3),
            !1
          );
        }),
        e.$on("playIntroInstructionVideo", function (a, o) {
          (e.videoSrc = o),
            console.log("data", o),
            e.renderFunctions2(),
            (e.percentage = 0);
        }),
        (e.pauseIntroInstructionVideo = function () {
          (e.playing = !1), i.pause();
        }),
        $("#videoIntroInstruction").hover(
          function () {
            $(".control-box").removeClass("mystyle");
          },
          function () {
            $(".control-box").addClass("mystyle");
          }
        ),
        (e.seek = function (o) {
          var n = o.offsetX / r[0].offsetWidth,
            t = n * i.duration;
          (i.currentTime = t),
            (e.percentage = Math.floor((100 / i.duration) * t)),
            (e.videoTime = a(i.currentTime));
        }),
        (e.setVolume = function () {
          0 == e.audio_volume
            ? (e.audio_volume = currVolume)
            : ((currVolume = e.audio_volume), (e.audio_volume = 0));
        }),
        (e.enable_AD = function () {
          e.enable_AD_btn = !e.enable_AD_btn;
        }),
        (e.settingBtn = function () {
          (e.enable_dropdown = !e.enable_dropdown),
            e.enable_dropdown
              ? (e.enable_settingOption = !0)
              : ((e.enable_settingOption = !1), (e.speed_dropdown = !1));
        }),
        (e.settingOption = function (a) {
          (e.enable_settingOption = !1),
            "speed" === a && (e.speed_dropdown = !0);
        }),
        (e.changeSpeed = function (a) {
          "setting" === a
            ? ((e.enable_settingOption = !0), (e.speed_dropdown = !1))
            : (i.playbackRate = a);
        }),
        e.$on("stopVideo", function (a, o) {
          (e.videoSrc = ""),
            (e.playing = !1),
            i && i.pause(),
            (e.centre_playing = !0);
        }),
        (e.fullScreen2 = function () {
          e.is_fullscreen
            ? i.requestFullscreen
              ? (i.requestFullscreen(), console.log(i.requestFullscreen()))
              : i.mozRequestFullScreen
              ? i.mozRequestFullScreen()
              : i.webkitRequestFullscreen
              ? i.webkitRequestFullscreen()
              : i.msRequestFullscreen && i.msRequestFullscreen()
            : document.exitFullscreen
            ? document.exitFullscreen()
            : document.webkitExitFullscreen
            ? document.webkitExitFullscreen()
            : document.mozCancelFullScreen
            ? document.mozCancelFullScreen()
            : document.msExitFullscreen && document.msExitFullscreen();
        });
    },
  ]),
  myView.directive("videoplayerintroinstructionDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      controller: "VideoPlayerIntroInstructionCtrl",
      templateUrl: "templates/videoControlIntroInstruction.html",
    };
  }),
  myView.controller("viewCtrl", [
    "$scope",
    "APPCONSTANT",
    "$timeout",
    "$interval",
    "$animate",
    "appService",
    function (e, a, o, r, i, n) {
      function t() {
        var e = window.innerWidth,
          a = window.innerHeight,
          o = 1,
          r = 1;
        e < 710 && (r = e / 1280), a > 1080 && (o = a / 1080);
        var i = "scale(" + r + "," + o + ")";
        $(".levelBg").css({ "-webkit-transform": i, transform: i });
        var n = Math.min(e / 1920, a / 1080),
          i = "scale(" + n + ") translate(-50%, -50%)";
        $(".allLevelsView").css({ "-webkit-transform": i, transform: i });
      }
      function l(e) {
        for (var a, o, r = e.length; 0 !== r; )
          (o = Math.floor(Math.random() * r)),
            (r -= 1),
            (a = e[r]),
            (e[r] = e[o]),
            (e[o] = a);
        return e;
      }
      function s(a) {
        var o = {
          "Palabras de ortografï¿½a": "Palabras de ortografía",
          "Mayï¿½s": "Mayús",
          capNÑ: "Ñ",
          "capNï¿½": "Ñ",
          capAÁ: "Á",
          "capAï¿½": "Á",
          capEÉ: "É",
          "capEï¿½": "É",
          capIÍ: "Í",
          "capIï¿½": "Í",
          capOÓ: "Ó",
          "capOï¿½": "Ó",
          capUÚ: "Ú",
          "capUï¿½": "Ú",
          capUUÜ: "Ü",
          "capUUï¿½": "Ü",
          smallnñ: "ñ",
          "smallnï¿½": "ñ",
          smallaá: "á",
          "smallaï¿½": "á",
          smalleé: "é",
          "smalleï¿½": "é",
          smallií: "í",
          "smalliï¿½": "í",
          smalloó: "ó",
          "smalloï¿½": "ó",
          smalluú: "ú",
          "smalluï¿½": "ú",
          smalluuü: "ü",
          "smalluuï¿½": "ü",
          "cafï¿½": "café",
          "trampolï¿½n": "trampolín",
          "trampollï¿½n": "trampollín",
          "floristerï¿½a": "floristería",
          "florï¿½steria": "florísteria",
          "ajï¿½": "ají",
          "agï¿½": "agí",
          "agitaciï¿½n": "agitación",
          "ajitaciï¿½n": "ajitación",
          "construï¿½": "construí",
          "construyï¿½": "construyí",
          "costruï¿½": "costruí",
          "mediodï¿½a": "mediodía",
          "mediadï¿½a": "mediadía",
          "telaraï¿½a": "telaraña",
          "telaaraï¿½a": "telaaraña",
          "teleraï¿½a": "teleraña",
          "dï¿½a": "día",
          "grï¿½a": "grúa",
          "gurï¿½a": "gurúa",
          "proteï¿½na": "proteína",
          "protoï¿½na": "protoína",
          "reï¿½": "reí",
          "rehï¿½": "rehí",
          "maï¿½z": "maíz",
          "maï¿½s": "maís",
          "paï¿½s": "país",
          "paï¿½z": "paíz",
          "envï¿½o": "envío",
          "henvï¿½o": "henvío",
          "gentï¿½o": "gentío",
          "jentï¿½o": "jentío",
          "baï¿½l": "baúl",
          "bahï¿½l": "bahúl",
          "desilusiï¿½n": "desilusión",
          "desiluciï¿½n": "desilución",
          "asï¿½": "así",
          "acï¿½": "ací",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "cï¿½men": "cómen",
          "comï¿½n": "comén",
          "ganï¿½": "ganó",
          "gï¿½no": "gáno",
          "apï¿½nas": "apénas",
          "ï¿½penas": "ápenas",
          "canciï¿½n": "canción",
          "cï¿½ncion": "cáncion",
          "tesï¿½ro": "tesóro",
          "tesorï¿½": "tesoró",
          "detrï¿½s": "detrás",
          "dï¿½tras": "détras",
          "valï¿½r": "valór",
          "vï¿½lor": "válor",
          "fï¿½cil": "fácil",
          "facï¿½l": "facíl",
          "ï¿½guila": "águila",
          "aguï¿½la": "aguíla",
          "brï¿½jula": "brújula",
          "brujulï¿½": "brujulá",
          "cientï¿½fico": "científico",
          "ciï¿½ntifico": "ciéntifico",
          "dï¿½cada": "década",
          "decï¿½da": "decáda",
          "quï¿½taselo": "quítaselo",
          "quitasï¿½lo": "quitasélo",
          "levï¿½ntate": "levántate",
          "levantï¿½te": "levantáte",
          "murciï¿½lago": "murciélago",
          "murcielï¿½go": "murcielágo",
          "sï¿½bado": "sábado",
          "sabï¿½do": "sabádo",
          "entrï¿½gamelo": "entrégamelo",
          "entregï¿½melo": "entregámelo",
          "ï¿½nico": "único",
          "unï¿½co": "uníco",
          "bï¿½ho": "búho",
          "bï¿½o": "búo",
          "vehï¿½culo": "vehículo",
          "veï¿½culo": "veículo",
          "bahï¿½a": "bahía",
          "baï¿½a": "baía",
          "ahijï¿½do": "ahijádo",
          "helï¿½do": "heládo",
          "hoguï¿½ra": "hoguéra",
          "ahorrï¿½r": "ahorrár",
          "ahumï¿½r": "ahumár",
          "ï¿½tiles": "útiles",
          "jï¿½ntos": "júntos",
          "lï¿½pices": "lápices",
          "lï¿½picez": "lápicez",
          "lï¿½pizez": "lápizez",
          "camiï¿½n": "camión",
          "cï¿½mion": "cámion",
          "marï¿½timo": "marítimo",
          "marï¿½stimo": "marístimo",
          "demï¿½s": "demás",
          "demï¿½z": "demáz",
          "aï¿½reo": "aéreo",
          "ï¿½ereo": "áereo",
          "ganï¿½do": "ganádo",
          "pingï¿½ino": "pingüino",
          "pengï¿½ino": "pengüino",
          "desagï¿½e": "desagüe",
          "bilingï¿½e": "bilingüe",
          "algï¿½nos": "algünos",
          "niï¿½ez": "niñez",
          "niï¿½es": "niñes",
          "bondï¿½": "bondá",
          "mirarï¿½": "miraré",
          "merarï¿½": "meraré",
          "jugï¿½": "jugó",
          "jï¿½go": "júgo",
          "cambiï¿½": "cambió",
          "cï¿½mbio": "cámbio",
          "escribï¿½": "escribé",
          "saltï¿½": "saltó",
          "sï¿½lto": "sálto",
          "cambiï¿½": "cambió",
          "cï¿½mbio": "cámbio",
          "volverï¿½": "volveré",
          "volvï¿½re": "volvére",
          "serï¿½": "seré",
          "sï¿½re": "sére",
          "saltï¿½": "salté",
          "sï¿½lte": "sálte",
          "votarï¿½": "votaré",
          "votï¿½re": "votáre",
          "ï¿½l": "él",
          "hï¿½l": "hél",
          "ï¿½l": "él",
          "sï¿½": "sí",
          "cï¿½": "cí",
          "mï¿½": "mí",
          "quï¿½": "qué",
          "qï¿½": "qé",
          "quï¿½": "qué",
          "cï¿½mo": "cómo",
          "kï¿½mo": "kómo",
          "sï¿½is": "séis",
          "difï¿½cil": "difícil",
          "difï¿½sil": "difísil",
          "avanzï¿½": "avanzó",
          "avansï¿½": "avansó",
          "narï¿½z": "naríz",
          "sï¿½mbolo": "símbolo",
          "sï¿½nbolo": "sínbolo",
          "sï¿½mvolo": "símvolo",
          "compï¿½s": "compás",
          "conpï¿½s": "conpás",
          "compï¿½z": "compáz",
          "sonreï¿½do": "sonreído",
          "somreï¿½do": "somreído",
          "traï¿½do": "traído",
          "trahï¿½do": "trahído",
          "aï¿½reo": "aéreo",
          "aï¿½rio": "aério",
          "hï¿½roe": "héroe",
          "hï¿½rue": "hérue",
          "camaleï¿½n": "camaleón",
          "kamaleï¿½n": "kamaleón",
          "aereolï¿½nea": "aereolínea",
          "aereolï¿½nea": "aereolínea",
          "poesï¿½a": "poesía",
          "puesï¿½a": "puesía",
          "geï¿½grafo": "geógrafo",
          "jeï¿½grafo": "jeógrafo",
          "canï¿½a": "canúa",
          "pasï¿½a": "pasía",
          "biografï¿½a": "biografía",
          "viografï¿½a": "viografía",
          "actï¿½a": "actúa",
          "hactï¿½a": "hactúa",
          "sonreï¿½rse": "sonreírse",
          "sonrreï¿½rse": "sonrreírse",
          "maï¿½z": "maíz",
          "maï¿½s": "maís",
          "sabï¿½a": "sabía",
          "savï¿½a": "savía",
          "habï¿½a": "había",
          "havï¿½a": "havía",
          "rï¿½o": "río",
          "rrï¿½o": "rrío",
          "recaï¿½da": "recaída",
          "rrecaï¿½da": "rrecaída",
          "distraï¿½do": "distraído",
          "destraï¿½do": "destraído",
          "gentï¿½o": "gentío",
          "jentï¿½o": "jentío",
          "baï¿½l": "baúl",
          "vaï¿½l": "vaúl",
          "proteï¿½na": "proteína",
          "protenï¿½a": "protenía",
          "aï¿½lla": "aúlla",
          "aï¿½ya": "aúya",
          "garantï¿½a": "garantía",
          "garentï¿½a": "garentía",
          "bohï¿½o": "bohío",
          "vohï¿½o": "vohío",
          "cacatï¿½a": "cacatúa",
          "kakatï¿½a": "kakatúa",
          "Raï¿½l": "Raúl",
          "Marï¿½a": "María",
          "Marrï¿½a": "Marría",
          "baterï¿½a": "batería",
          "vaterï¿½a": "vatería",
          "mï¿½o": "mío",
          "mï¿½u": "míu",
          "inacciï¿½n": "inacción",
          "inaxiï¿½n": "inaxión",
          "sobreactuï¿½r": "sobreactuár",
          "sobresalï¿½r": "sobresalír",
          "subacuï¿½tico": "subacuático",
          "suvacuï¿½tico": "suvacuático",
          "subestaciï¿½n": "subestación",
          "suvestaciï¿½n": "suvestación",
          "imï¿½genes": "imágenes",
          "imï¿½jenes": "imájenes",
          "lï¿½pices": "lápices",
          "lï¿½pizes": "lápizes",
          "lï¿½pises": "lápises",
          "telï¿½fonos": "teléfonos",
          "telï¿½fones": "teléfones",
          "lugï¿½ares": "lugüares",
          "dï¿½adema": "díadema",
          "reuniï¿½n": "reunión",
          "riuniï¿½n": "riunión",
          "bï¿½isbol": "béisbol",
          "beisbï¿½l": "beisból",
          "vï¿½isbol": "véisbol",
          "ruï¿½nas": "ruínas",
          "ruï¿½do": "ruído",
          "fuï¿½": "fuí",
          "foï¿½": "foí",
          "incluï¿½do": "incluído",
          "ruiseï¿½or": "ruiseñor",
          "ruiceï¿½or": "ruiceñor",
          "intuiciï¿½n": "intuición",
          "intuisiï¿½n": "intuisión",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biografï¿½a": "biografía",
          "beografï¿½a": "beografía",
          "fonï¿½ma": "fonéma",
          "fonï¿½tica": "fonética",
          "fonï¿½tika": "fonétika",
          "polï¿½glota": "políglota",
          "pulï¿½glota": "pulíglota",
          "fonografï¿½a": "fonografía",
          "fonogrefï¿½a": "fonogrefía",
          "grï¿½fico": "gráfico",
          "grï¿½fiko": "gráfiko",
          "monolingï¿½e": "monolingüe",
          "monografï¿½a": "monografía",
          "monegrafï¿½a": "monegrafía",
          "grafologï¿½a": "grafología",
          "grafolojï¿½a": "grafolojía",
          "policï¿½falo": "policéfalo",
          "polisï¿½falo": "poliséfalo",
          "polï¿½gono": "polígono",
          "polï¿½gomo": "polígomo",
          "policromï¿½a": "policromía",
          "polikromï¿½a": "polikromía",
          "acuï¿½rio": "acuário",
          "acuï¿½tico": "acuático",
          "hacuï¿½tico": "hacuático",
          "acuanï¿½uta": "acuanáuta",
          "acuï¿½so": "acuóso",
          "acuarï¿½la": "acuaréla",
          "acuï¿½fero": "acuífero",
          "aquï¿½fero": "aquífero",
          "dicciï¿½n": "dicción",
          "dixiï¿½n": "dixión",
          "dicsiï¿½n": "dicsión",
          "dictï¿½do": "dictádo",
          "dictï¿½r": "dictár",
          "dictï¿½men": "dictámen",
          "edï¿½cto": "edícto",
          "veredï¿½cto": "veredícto",
          "dictaminï¿½r": "dictaminár",
          "dictadï¿½r": "dictadór",
          "aï¿½reo": "aéreo",
          "haï¿½reo": "haéreo",
          "ï¿½ire": "áire",
          "cï¿½mara": "cámara",
          "kï¿½mara": "kámara",
          "camarï¿½grafo": "camarógrafo",
          "camarogrï¿½fo": "camarográfo",
          "composiciï¿½n": "composición",
          "composisiï¿½n": "composisión",
          "fï¿½cil": "fácil",
          "fï¿½sil": "fásil",
          "imï¿½gen": "imágen",
          "imï¿½genes": "imágenes",
          "imï¿½jenes": "imájenes",
          "necesitarï¿½a": "necesitaría",
          "nececitarï¿½a": "nececitaría",
          "nesesitarï¿½a": "nesesitaría",
          "produxiï¿½n": "produxión",
          "producsiï¿½n": "producsión",
          "reï¿½ne": "reúne",
          "rreï¿½ne": "rreúne",
          "reuniï¿½n": "reunión",
          "rreuniï¿½n": "rreunión",
          "Panamï¿½": "Panamá",
          "Pamamï¿½": "Pamamá",
          "guaranï¿½": "guaraná",
          "waranï¿½": "waraná",
          "chimpancï¿½": "chimpancé",
          "chimpansï¿½": "chimpansé",
          "comitï¿½": "comité",
          "cometï¿½": "cometé",
          "jamï¿½s": "jamás",
          "jammï¿½s": "jammás",
          "ajonjolï¿½": "ajonjolí",
          "agonjolï¿½": "agonjolí",
          "colibrï¿½": "colibrí",
          "colivrï¿½": "colivrí",
          "conclusiï¿½n": "conclusión",
          "concluciï¿½n": "conclución",
          "acciï¿½n": "acción",
          "axiï¿½n": "axión",
          "acsiï¿½n": "acsión",
          "algodï¿½n": "algodón",
          "halgodï¿½n": "halgodón",
          "ademï¿½s": "además",
          "hademï¿½s": "hademás",
          "dï¿½bil": "débil",
          "dï¿½vil": "dévil",
          "ï¿½rbol": "árbol",
          "ï¿½rvol": "árvol",
          "fï¿½cil": "fácil",
          "fï¿½sil": "fásil",
          "cï¿½sped": "césped",
          "hï¿½bil": "hábil",
          "hï¿½vil": "hávil",
          "difï¿½cil": "difícil",
          "difï¿½sil": "difísil",
          "lï¿½piz": "lápiz",
          "lï¿½pis": "lápis",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "pï¿½ster": "póster",
          "pï¿½sster": "pósster",
          "reacciï¿½n": "reacción",
          "reaxiï¿½n": "reaxión",
          "reacsiï¿½n": "reacsión",
          "misiï¿½n": "misión",
          "miciï¿½n": "mición",
          "canciï¿½n": "canción",
          "cansiï¿½n": "cansión",
          "ilusiï¿½n": "ilusión",
          "iluciï¿½n": "ilución",
          "confusiï¿½n": "confusión",
          "confuciï¿½n": "confución",
          "dedicaciï¿½n": "dedicación",
          "dedicasiï¿½n": "dedicasión",
          "porciï¿½n": "porción",
          "porsiï¿½n": "porsión",
          "divisiï¿½n": "división",
          "diviciï¿½n": "divición",
          "tensiï¿½n": "tensión",
          "tenciï¿½n": "tención",
          "fusiï¿½n": "fusión",
          "fuciï¿½n": "fución",
          "presiï¿½n": "presión",
          "preciï¿½n": "preción",
          "protecciï¿½n": "protección",
          "protexiï¿½n": "protexión",
          "protecsiï¿½n": "protecsión",
          "mansiï¿½n": "mansión",
          "manciï¿½n": "manción",
          "profesiï¿½n": "profesión",
          "profeciï¿½n": "profeción",
          "posiciï¿½n": "posición",
          "posisiï¿½n": "posisión",
          "pociciï¿½n": "pocición",
          "direcciï¿½n": "dirección",
          "direxiï¿½n": "direxión",
          "direcsiï¿½n": "direcsión",
          "emociï¿½n": "emoción",
          "emosiï¿½n": "emosión",
          "hemosiï¿½n": "hemosión",
          "lociï¿½n": "loción",
          "losiï¿½n": "losión",
          "diversiï¿½n": "diversión",
          "diverciï¿½n": "diverción",
          "dibersiï¿½n": "dibersión",
          "estaciï¿½n": "estación",
          "estasiï¿½n": "estasión",
          "Mï¿½xico": "México",
          "lï¿½grimas": "lágrimas",
          "lï¿½gremas": "lágremas",
          "mï¿½sica": "música",
          "mï¿½sika": "músika",
          "vï¿½rtices": "vértices",
          "vï¿½rtises": "vértises",
          "dï¿½cada": "década",
          "dï¿½kada": "dékada",
          "rï¿½pido": "rápido",
          "rrï¿½pido": "rrápido",
          "pï¿½blico": "público",
          "pï¿½bliko": "públiko",
          "esdrï¿½jula": "esdrújula",
          "sdrï¿½jula": "sdrújula",
          "ï¿½ngulo": "ángulo",
          "ï¿½ngï¿½lo": "ángülo",
          "pï¿½jaro": "pájaro",
          "pï¿½garo": "págaro",
          "nï¿½madas": "nómadas",
          "nï¿½madas": "námadas",
          "recomiï¿½ndaselo": "recomiéndaselo",
          "recomiï¿½ndacelo": "recomiéndacelo",
          "vï¿½monos": "vámonos",
          "bï¿½monos": "bámonos",
          "llï¿½vaselo": "llévaselo",
          "llï¿½vacelo": "llévacelo",
          "pï¿½samelo": "pásamelo",
          "pï¿½zamelo": "pázamelo",
          "cuï¿½ntamela": "cuéntamela",
          "kuï¿½ntamela": "kuéntamela",
          "regï¿½lasela": "regálasela",
          "rejï¿½lasela": "rejálasela",
          "devuï¿½lvemelo": "devuélvemelo",
          "debuï¿½lvemelo": "debuélvemelo",
          "aprï¿½ndetela": "apréndetela",
          "aprendetelï¿½": "aprendetelá",
          "prï¿½stamelo": "préstamelo",
          "prestamelï¿½": "prestameló",
          "almohï¿½da": "almoháda",
          "ahogï¿½do": "ahogádo",
          "bahï¿½a": "bahía",
          "baï¿½a": "baía",
          "turbohï¿½lice": "turbohélice",
          "turbohï¿½lise": "turbohélise",
          "turvohï¿½lice": "turvohélice",
          "ahï¿½nco": "ahínco",
          "aï¿½nco": "aínco",
          "alcï¿½l": "alcól",
          "alchï¿½l": "alchól",
          "zoolï¿½gico": "zoológico",
          "zolï¿½gico": "zológico",
          "soolï¿½gico": "soológico",
          "prohï¿½ben": "prohíben",
          "proï¿½ben": "proíben",
          "prohï¿½ven": "prohíven",
          "vehï¿½culo": "vehículo",
          "veï¿½culo": "veículo",
          "releyï¿½": "releyó",
          "relellï¿½": "relelló",
          "releiï¿½": "releió",
          "antisï¿½smico": "antisísmico",
          "antesï¿½smico": "antesísmico",
          "antiï¿½cido": "antiácido",
          "anteï¿½cido": "anteácido",
          "antiï¿½sido": "antiásido",
          "antiatï¿½mico": "antiatómico",
          "anteatï¿½mico": "anteatómico",
          "reagrupï¿½": "reagrupó",
          "regrupï¿½": "regrupó",
          "dormirï¿½s": "dormirás",
          "caminarï¿½": "caminaré",
          "camimarï¿½": "camimaré",
          "saldrï¿½amos": "saldríamos",
          "zaldrï¿½amos": "zaldríamos",
          "visitarï¿½s": "visitarás",
          "vicitarï¿½s": "vicitarás",
          "mirarï¿½": "miraré",
          "mirrarï¿½": "mirraré",
          "verï¿½s": "verás",
          "berï¿½s": "berás",
          "comerï¿½an": "comerían",
          "komerï¿½an": "komerían",
          "estarï¿½n": "estarán",
          "eztarï¿½n": "eztarán",
          "pasï¿½bamos": "pasábamos",
          "pasï¿½vamos": "pasávamos",
          "comï¿½": "comí",
          "komï¿½": "komí",
          "volverï¿½n": "volverán",
          "volberï¿½n": "volberán",
          "podrï¿½s": "podrás",
          "podrï¿½z": "podráz",
          "dï¿½bamos": "dábamos",
          "saltarï¿½a": "saltaría",
          "zaltarï¿½a": "zaltaría",
          "nadarï¿½a": "nadaría",
          "nadï¿½ria": "nadária",
          "trabajï¿½": "trabajó",
          "trabï¿½jo": "trabájo",
          "pasï¿½": "pasó",
          "pï¿½so": "páso",
          "ï¿½bamos": "íbamos",
          "ï¿½vamos": "ívamos",
          "cultivarï¿½a": "cultivaría",
          "cultibarï¿½a": "cultibaría",
          "fuï¿½ramos": "fuéramos",
          "fuerï¿½mos": "fuerámos",
          "fonometrï¿½a": "fonometría",
          "fonemetrï¿½a": "fonemetría",
          "fonï¿½tica": "fonética",
          "fonï¿½tica": "fonótica",
          "microbï¿½s": "microbús",
          "mecrobï¿½s": "mecrobús",
          "perï¿½metro": "perímetro",
          "pirï¿½metro": "pirímetro",
          "megï¿½fono": "megáfono",
          "meguï¿½fono": "meguáfono",
          "megalï¿½polis": "megalópolis",
          "megualï¿½polis": "megualópolis",
          "telï¿½fono": "teléfono",
          "tilï¿½fono": "tiléfono",
          "micrï¿½fono": "micrófono",
          "mecrï¿½fono": "mecrófono",
          "anglï¿½fono": "anglófono",
          "botï¿½r": "botár",
          "votï¿½r": "votár",
          "hï¿½cho": "hécho",
          "ï¿½cho": "écho",
          "cï¿½llo": "cállo",
          "cï¿½yo": "cáyo",
          "hï¿½la": "hóla",
          "ï¿½la": "óla",
          "hï¿½ndas": "hóndas",
          "ï¿½ndas": "óndas",
          "ï¿½sta": "ásta",
          "hï¿½sta": "hásta",
          "tï¿½bo": "túbo",
          "tï¿½vo": "túvo",
          "cosï¿½r": "cosér",
          "cocï¿½r": "cocér",
          "portï¿½til": "portátil",
          "portï¿½tel": "portátel",
          "portï¿½ro": "portéro",
          "aportï¿½r": "aportár",
          "portï¿½da": "portáda",
          "genealogï¿½a": "genealogía",
          "genealojï¿½a": "genealojía",
          "genialogï¿½a": "genialogía",
          "generaciï¿½n": "generación",
          "jeneraciï¿½n": "jeneración",
          "generasiï¿½n": "generasión",
          "generï¿½l": "generál",
          "generï¿½r": "generár",
          "duraciï¿½n": "duración",
          "durasiï¿½n": "durasión",
          "duraziï¿½n": "durazión",
          "durï¿½za": "duréza",
          "duradï¿½ro": "duradéro",
          "proyï¿½cto": "proyécto",
          "proyectï¿½r": "proyectór",
          "trayï¿½cto": "trayécto",
          "inyectï¿½r": "inyectár",
          "genï¿½tica": "genética",
          "jenï¿½tica": "jenética",
          "regenerï¿½r": "regenerár",
          "temprï¿½no": "tempráno",
          "contramï¿½no": "contramáno",
          "humï¿½no": "humáno",
          "lozï¿½na": "lozána",
          "andinï¿½smo": "andinísmo",
          "naturalï¿½sta": "naturalísta",
          "pianï¿½sta": "pianísta",
          "aï¿½n": "aún",
          "haï¿½n": "haún",
          "ahï¿½n": "ahún",
          "dï¿½": "dé",
          "ddï¿½": "ddé",
          "dï¿½e": "dée",
          "hï¿½l": "hél",
          "mï¿½s": "más",
          "mmï¿½s": "mmás",
          "mï¿½as": "máas",
          "mï¿½i": "míi",
          "mmï¿½": "mmí",
          "sï¿½": "sé",
          "sï¿½e": "sée",
          "ssï¿½": "ssí",
          "sï¿½i": "síi",
          "tï¿½": "té",
          "ttï¿½": "tté",
          "tï¿½e": "tée",
          "tï¿½": "tú",
          "tï¿½u": "túu",
          "ttï¿½": "ttú",
          "quï¿½": "qué",
          "quuï¿½": "quué",
          "quï¿½e": "quée",
          "excï¿½ntrico": "excéntrico",
          "exï¿½ntrico": "exéntrico",
          "exsï¿½ntrico": "exséntrico",
          "posmodï¿½rno": "posmodérno",
          "biaï¿½ual": "biañual",
          "biangï¿½lar": "biangülar",
          "triï¿½ngulo": "triángulo",
          "triï¿½ngï¿½lo": "triángülo",
          "triatlï¿½n": "triatlón",
          "trisatlï¿½n": "trisatlón",
          "transacciï¿½n": "transacción",
          "transacsiï¿½n": "transacsión",
          "transaciï¿½n": "transación",
          "televisiï¿½n": "televisión",
          "televiciï¿½n": "televición",
          "telecomunicaciï¿½n": "telecomunicación",
          "telecomunicasiï¿½n": "telecomunicasión",
          "telefonï¿½a": "telefonía",
          "telfonï¿½a": "telfonía",
          "fotografï¿½a": "fotografía",
          "fotogrefï¿½a": "fotogrefía",
          "biografï¿½a": "biografía",
          "bigrafï¿½a": "bigrafía",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "metrologï¿½a": "metrología",
          "metrolojï¿½a": "metrolojía",
          "metrilogï¿½a": "metrilogía",
          "fonï¿½grafo": "fonógrafo",
          "fonogrï¿½fo": "fonográfo",
          "telepatï¿½a": "telepatía",
          "telpatï¿½a": "telpatía",
          "telefï¿½rico": "teleférico",
          "telesfï¿½rico": "telesférico",
          "biomï¿½trico": "biométrico",
          "bimï¿½trico": "bimétrico",
          "termï¿½metro": "termómetro",
          "termomï¿½tro": "termométro",
          "cronï¿½metro": "cronómetro",
          "cronomï¿½tro": "cronométro",
          "apï¿½grafo": "apógrafo",
          "apogrï¿½fo": "apográfo",
          "psicologï¿½a": "psicología",
          "psicolojï¿½a": "psicolojía",
          "psicolï¿½gia": "psicológia",
          "favoritï¿½smo": "favoritísmo",
          "favoritï¿½smo": "favoritísmo",
          "aï¿½robismo": "aérobismo",
          "abolicionï¿½sta": "abolicionísta",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biolï¿½gia": "biológia",
          "realï¿½smo": "realísmo",
          "automovilï¿½smo": "automovilísmo",
          "realï¿½sta": "realísta",
          "reï¿½lista": "reálista",
          "tecnologï¿½a": "tecnología",
          "tecnolojï¿½a": "tecnolojía",
          "tecnolï¿½gia": "tecnológia",
          "modï¿½smo": "modísmo",
          "analï¿½sta": "analísta",
          "anï¿½lista": "análista",
          "meteorologï¿½a": "meteorología",
          "meteorolojï¿½a": "meteorolojía",
          "meteorï¿½logia": "meteorólogia",
          "cï¿½vismo": "cívismo",
          "ecologï¿½a": "ecología",
          "ecolojï¿½a": "ecolojía",
          "ecï¿½logia": "ecólogia",
          "racï¿½smo": "racísmo",
          "mitologï¿½a": "mitología",
          "mitolojï¿½a": "mitolojía",
          "mitï¿½logia": "mitólogia",
          "optimï¿½sta": "optimísta",
          "conservasionismï¿½": "conservasionismó",
          "antropologï¿½a": "antropología",
          "antropolojï¿½a": "antropolojía",
          "antrï¿½pologia": "antrópologia",
          "cronologï¿½a": "cronología",
          "cronolojï¿½a": "cronolojía",
          "crï¿½nologia": "crónologia",
          "kilï¿½metro": "kilómetro",
          "quilï¿½metro": "quilómetro",
          "kilomï¿½tro": "kilométro",
          "fotografï¿½a": "fotografía",
          "fotogrï¿½fia": "fotográfia",
          "geologï¿½a": "geología",
          "jeologï¿½a": "jeología",
          "geolojï¿½a": "geolojía",
          "geolï¿½gia": "geológia",
          "cronolï¿½gico": "cronológico",
          "cronolï¿½jico": "cronolójico",
          "cronï¿½logia": "cronólogia",
          "centï¿½metro": "centímetro",
          "sentï¿½metro": "sentímetro",
          "centimï¿½tro": "centimétro",
          "neoclï¿½sico": "neoclásico",
          "nï¿½oclasico": "néoclasico",
          "geï¿½logo": "geólogo",
          "jeï¿½logo": "jeólogo",
          "geolï¿½go": "geológo",
          "crï¿½nico": "crónico",
          "cronï¿½co": "croníco",
          "cronicï¿½": "cronicó",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biolï¿½gia": "biológia",
          "neolï¿½tico": "neolítico",
          "nï¿½olitico": "néolitico",
          "neolitï¿½co": "neolitíco",
          "geografï¿½a": "geografía",
          "jeografï¿½a": "jeografía",
          "geogrï¿½fia": "geográfia",
          "fotogï¿½nica": "fotogénica",
          "fotojï¿½nica": "fotojénica",
          "fotï¿½genica": "fotógenica",
          "termï¿½metro": "termómetro",
          "tï¿½rmometro": "térmometro",
          "termomï¿½tro": "termométro",
          "fotosï¿½ntesis": "fotosíntesis",
          "fotocï¿½ntesis": "fotocíntesis",
          "fotosintï¿½sis": "fotosintésis",
          "geometrï¿½a": "geometría",
          "jeometrï¿½a": "jeometría",
          "geomï¿½tria": "geométria",
          "sincrï¿½nizar": "sincrónizar",
          "perï¿½metro": "perímetro",
          "perimï¿½tro": "perimétro",
          "fotoelï¿½ctrico": "fotoeléctrico",
          "fotolï¿½ctrico": "fotoléctrico",
          "fotoelectrï¿½co": "fotoelectríco",
          "geomï¿½trico": "geométrico",
          "jeomï¿½trico": "jeométrico",
          "ï¿½ire": "áire",
          "caï¿½sa": "caúsa",
          "acï¿½ite": "acéite",
          "dï¿½uda": "déuda",
          "deudï¿½": "deudá",
          "trapezï¿½ide": "trapezóide",
          "trapezoï¿½de": "trapezoíde",
          "lï¿½mpia": "límpia",
          "limpï¿½a": "limpía",
          "virrï¿½y": "virréy",
          "buï¿½y": "buéy",
          "miï¿½u": "miáu",
          "violï¿½n": "violín",
          "biolï¿½n": "biolín",
          "veolï¿½n": "veolín",
          "poï¿½ma": "poéma",
          "poemï¿½": "poemá",
          "Uruguï¿½y": "Uruguáy",
          "patalï¿½a": "pataléa",
          "pataleï¿½": "pataleá",
          "diciï¿½mbre": "diciémbre",
          "cualidï¿½d": "cualidád",
          "mediï¿½na": "mediána",
          "medianï¿½": "medianá",
          "guayï¿½ba": "guayába",
          "aguacerï¿½": "aguaceró",
          "audï¿½ble": "audíble",
          "detalladamï¿½nte": "detalladaménte",
          "detallï¿½damente": "detalládamente",
          "rï¿½pidamente": "rápidamente",
          "rapidamï¿½nte": "rapidaménte",
          "rapidï¿½mente": "rapidámente",
          "completï¿½mente": "completámente",
          "difï¿½cilmente": "difícilmente",
          "difï¿½silmente": "difísilmente",
          "dificilmï¿½nte": "dificilménte",
          "cuidadï¿½samente": "cuidadósamente",
          "cuidadosï¿½mente": "cuidadosámente",
          "abundï¿½nte": "abundánte",
          "ayudï¿½nte": "ayudánte",
          "tranquilamï¿½nte": "tranquilaménte",
          "tranquilï¿½mente": "tranquilámente",
          "importï¿½nte": "importánte",
          "iguï¿½lmente": "iguálmente",
          "desodorï¿½nte": "desodoránte",
          "calmï¿½nte": "calmánte",
          "desafiï¿½nte": "desafiánte",
          "sutï¿½lmente": "sutílmente",
          "sï¿½tilmente": "sútilmente",
          "cariï¿½osamente": "cariñosamente",
          "cariï¿½ozamente": "cariñozamente",
          "cariï¿½ï¿½samente": "cariñósamente",
          "justamï¿½nte": "justaménte",
          "jï¿½stamente": "jústamente",
          "atentamï¿½nte": "atentaménte",
          "atï¿½ntamente": "aténtamente",
          "cï¿½ntradictorio": "cóntradictorio",
          "biolï¿½n": "biolín",
          "edificï¿½r": "edificár",
          "edï¿½ficar": "edíficar",
          "portafï¿½lios": "portafólios",
          "pï¿½rtafolios": "pórtafolios",
          "terrï¿½stre": "terréstre",
          "terrestrï¿½": "terrestré",
          "dictadï¿½r": "dictadór",
          "exportï¿½r": "exportár",
          "gratificï¿½r": "gratificár",
          "aterrizï¿½r": "aterrizár",
          "atï¿½rrizar": "atérrizar",
          "veredï¿½cto": "veredícto",
          "personificï¿½r": "personificár",
          "pasapï¿½rte": "pasapórte",
          "terrï¿½za": "terráza",
          "dictï¿½r": "dictár",
          "dictï¿½men": "dictámen",
          "terrï¿½no": "terréno",
          "plastificï¿½r": "plastificár",
          "comportamiï¿½nto": "comportamiénto",
          "trï¿½nsporte": "tránsporte",
          "territï¿½rio": "território",
          "continï¿½a": "continúa",
          "kontinï¿½a": "kontinúa",
          "comtinï¿½a": "comtinúa",
          "continï¿½a": "continóa",
          "gradï¿½an": "gradúan",
          "gredï¿½an": "gredúan",
          "graduï¿½r": "graduár",
          "sï¿½ria": "séria",
          "serï¿½a": "sería",
          "serï¿½a": "seréa",
          "cerï¿½a": "cería",
          "serrï¿½a": "serría",
          "zï¿½bia": "zábia",
          "sabï¿½a": "sabía",
          "zabï¿½a": "zabía",
          "zabï¿½a": "zabéa",
          "sabï¿½a": "sabéa",
          "paï¿½s": "país",
          "paï¿½z": "paíz",
          "pï¿½is": "páis",
          "paisï¿½je": "paisáje",
          "sonrï¿½e": "sonríe",
          "sonrrï¿½e": "sonrríe",
          "sonriï¿½": "sonrió",
          "sonrriï¿½": "sonrrió",
          "somriï¿½": "somrió",
          "sonriï¿½ndome": "sonriéndome",
          "sonrriï¿½ndome": "sonrriéndome",
          "sorriï¿½ndome": "sorriéndome",
          "hiervï¿½": "hiervó",
          "austeridï¿½d": "austeridád",
          "veï¿½amos": "veíamos",
          "beï¿½amos": "beíamos",
          "veiï¿½mos": "veiámos",
          "caimï¿½n": "caimán",
          "caemï¿½n": "caemán",
          "cï¿½iman": "cáiman",
          "espï¿½cio": "espácio",
          "cuï¿½rvo": "cuérvo",
          "sirviï¿½nte": "sirviénte",
          "emociï¿½n": "emoción",
          "emosiï¿½n": "emosión",
          "ï¿½mocion": "émocion",
          "mansiï¿½n": "mansión",
          "manciï¿½n": "manción",
          "mï¿½nsion": "mánsion",
          "tensiï¿½n": "tensión",
          "tenciï¿½n": "tención",
          "tï¿½nsion": "ténsion",
          "corrï¿½r": "corrér",
          "alfilï¿½r": "alfilér",
          "ï¿½lfiler": "álfiler",
          "jabalï¿½": "jabalí",
          "gabalï¿½": "gabalí",
          "jï¿½bali": "jábali",
          "sartï¿½n": "sartén",
          "zartï¿½n": "zartén",
          "sï¿½rten": "sárten",
          "audï¿½z": "audáz",
          "ï¿½udaz": "áudaz",
          "ademï¿½s": "además",
          "hademï¿½s": "hademás",
          "ï¿½demas": "ádemas",
          "jamï¿½s": "jamás",
          "gamï¿½s": "gamás",
          "jï¿½mas": "jámas",
          "sofï¿½": "sofá",
          "zofï¿½": "zofá",
          "sï¿½fa": "sófa",
          "hotï¿½l": "hotél",
          "corazï¿½n": "corazón",
          "corasï¿½n": "corasón",
          "cï¿½razon": "córazon",
          "medï¿½r": "medír",
          "allï¿½": "allí",
          "hallï¿½": "hallí",
          "ayï¿½": "ayí",
          "perejï¿½l": "perejíl",
          "pï¿½rejil": "pérejil",
          "millï¿½n": "millón",
          "miyï¿½n": "miyón",
          "mï¿½llon": "míllon",
          "cafï¿½": "café",
          "kafï¿½": "kafé",
          "cï¿½fe": "cáfe",
          "altitï¿½d": "altitúd",
          "ï¿½ltitud": "áltitud",
          "lï¿½piz": "lápiz",
          "lï¿½pis": "lápis",
          "lapï¿½z": "lapíz",
          "fï¿½rtil": "fértil",
          "fï¿½rtel": "fértel",
          "fertï¿½l": "fertíl",
          "ï¿½gil": "ágil",
          "hï¿½gil": "hágil",
          "ï¿½jil": "ájil",
          "agï¿½l": "agíl",
          "ï¿½ngel": "ángel",
          "ï¿½njel": "ánjel",
          "angï¿½l": "angél",
          "ï¿½til": "útil",
          "hï¿½til": "hútil",
          "utï¿½l": "utíl",
          "mï¿½vil": "móvil",
          "mï¿½bil": "móbil",
          "movï¿½l": "movíl",
          "ï¿½rbol": "árbol",
          "hï¿½rbol": "hárbol",
          "arbï¿½l": "arból",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "ï¿½zucar": "ázucar",
          "crï¿½ter": "cráter",
          "cratï¿½r": "cratér",
          "cï¿½sped": "césped",
          "sï¿½sped": "sésped",
          "cespï¿½d": "cespéd",
          "cuï¿½rno": "cuérno",
          "cuernï¿½": "cuernó",
          "encï¿½ma": "encíma",
          "sï¿½na": "sána",
          "cariï¿½osas": "cariñosas",
          "cariï¿½ozas": "cariñozas",
          "cï¿½riï¿½osas": "cáriñosas",
          "valiï¿½nte": "valiénte",
          "palï¿½bra": "palábra",
          "pï¿½labra": "pálabra",
          "cï¿½rcel": "cárcel",
          "cï¿½rsel": "cársel",
          "carcï¿½l": "carcél",
          "hï¿½mbro": "hómbro",
          "estï¿½ndar": "estándar",
          "hestï¿½ndar": "hestándar",
          "estandï¿½r": "estandár",
          "ustï¿½des": "ustédes",
          "ï¿½stedes": "ústedes",
          "ï¿½ltimo": "último",
          "hï¿½ltimo": "húltimo",
          "ultï¿½mo": "ultímo",
          "fï¿½rmula": "fórmula",
          "formï¿½la": "formúla",
          "formulï¿½": "formulá",
          "lï¿½gica": "lógica",
          "lï¿½jica": "lójica",
          "logicï¿½": "logicá",
          "mï¿½gica": "mágica",
          "mï¿½jica": "májica",
          "magï¿½ca": "magíca",
          "parï¿½sito": "parásito",
          "parï¿½cito": "parácito",
          "pï¿½rasito": "párasito",
          "mecï¿½nico": "mecánico",
          "mecï¿½neco": "mecáneco",
          "mï¿½canico": "mécanico",
          "brï¿½jula": "brújula",
          "brï¿½gula": "brúgula",
          "brujï¿½la": "brujúla",
          "vï¿½ndeselo": "véndeselo",
          "vendesï¿½lo": "vendesélo",
          "cï¿½mpraselo": "cómpraselo",
          "comprasï¿½lo": "comprasélo",
          "esdrï¿½jula": "esdrújula",
          "esdrï¿½gula": "esdrúgula",
          "esdrujï¿½la": "esdrujúla",
          "vï¿½monos": "vámonos",
          "vï¿½mosnos": "vámosnos",
          "vamonï¿½s": "vamonós",
          "pï¿½talo": "pétalo",
          "petalï¿½": "petaló",
          "petï¿½lo": "petálo",
          "prï¿½stamelo": "préstamelo",
          "prestamï¿½lo": "prestamélo",
          "prestamelï¿½": "prestameló",
          "tï¿½matelo": "tómatelo",
          "tomatï¿½lo": "tomatélo",
          "tomatelï¿½": "tomateló",
          "cï¿½metelo": "cómetelo",
          "cometï¿½lo": "cometélo",
          "cometelï¿½": "cometeló",
          "lï¿½mina": "lámina",
          "lamï¿½na": "lamína",
          "laminï¿½": "laminá",
          "ï¿½ndice": "índice",
          "ï¿½ndise": "índise",
          "indicï¿½": "indicé",
          "ï¿½nimo": "ánimo",
          "anï¿½mo": "anímo",
          "animï¿½": "animó",
          "ï¿½dolo": "ídolo",
          "idï¿½lo": "idólo",
          "idolï¿½": "idoló",
          "dï¿½melo": "dímelo",
          "dimï¿½lo": "dimélo",
          "dimelï¿½": "dimeló",
          "cobrï¿½zo": "cobrízo",
          "enfï¿½rmiza": "enférmiza",
          "plomï¿½zo": "plomízo",
          "cobï¿½rtizo": "cobértizo",
          "fronterï¿½zo": "fronterízo",
          "primerï¿½za": "primeríza",
          "caballï¿½riza": "caballériza",
          "advenï¿½dizo": "advenédizo",
          "sï¿½": "sí",
          "ssï¿½": "ssí",
          "sï¿½i": "síi",
          "zï¿½": "zí",
          "sï¿½": "sé",
          "sï¿½e": "sée",
          "ssï¿½": "ssé",
          "dï¿½": "dé",
          "ddï¿½": "ddé",
          "dï¿½e": "dée",
          "mï¿½s": "más",
          "mmï¿½s": "mmás",
          "mï¿½as": "máas",
          "mï¿½z": "máz",
          "tï¿½": "té",
          "ttï¿½": "tté",
          "tï¿½e": "tée",
          "ï¿½l": "él",
          "hï¿½l": "hél",
          "hï¿½l": "hél",
          "tï¿½": "tú",
          "tï¿½u": "túu",
          "ttï¿½": "ttú",
          "mï¿½": "mí",
          "mï¿½i": "míi",
          "mmï¿½": "mmí",
          "cï¿½mo": "cómo",
          "cï¿½mmo": "cómmo",
          "cï¿½omo": "cóomo",
          "quï¿½": "qué",
          "quuï¿½": "quué",
          "quï¿½e": "quée",
          "qï¿½": "qé",
          "pasï¿½bamos": "pasábamos",
          "pasï¿½vamos": "pasávamos",
          "pasï¿½abamos": "paséabamos",
          "apretï¿½": "apreté",
          "aprietï¿½": "aprieté",
          "salï¿½": "salí",
          "zalï¿½": "zalí",
          "salï¿½": "salé",
          "partï¿½": "partí",
          "pï¿½rti": "párti",
          "partï¿½": "parté",
          "dejï¿½": "dejé",
          "degï¿½": "degé",
          "dejï¿½": "dejí",
          "comï¿½amos": "comíamos",
          "comiï¿½mos": "comiámos",
          "comï¿½amos": "coméamos",
          "tomï¿½": "tomé",
          "tï¿½me": "tóme",
          "tomï¿½": "tomí",
          "podrï¿½a": "podría",
          "podrï¿½a": "podréa",
          "pondriï¿½": "pondriá",
          "iniciarï¿½a": "iniciaría",
          "inisiarï¿½a": "inisiaría",
          "iniciariï¿½": "iniciariá",
          "sabrï¿½a": "sabría",
          "zabrï¿½a": "zabría",
          "sï¿½bria": "sábria",
          "habrï¿½a": "habría",
          "hï¿½bria": "hábria",
          "saldrï¿½a": "saldría",
          "zaldrï¿½a": "zaldría",
          "saldriï¿½": "saldriá",
          "comerï¿½a": "comería",
          "comï¿½ria": "coméria",
          "comeriï¿½": "comeriá",
          "irï¿½": "iré",
          "tendrï¿½": "tendré",
          "temdrï¿½": "temdré",
          "tï¿½ndre": "téndre",
          "correrï¿½": "correrá",
          "corrï¿½ra": "corréra",
          "cï¿½rrera": "córrera",
          "imaginarï¿½": "imaginaré",
          "imajinarï¿½": "imajinaré",
          "imï¿½ginare": "imáginare",
          "pagarï¿½": "pagaré",
          "pagï¿½re": "pagáre",
          "pï¿½gare": "págare",
          "viajï¿½bamos": "viajábamos",
          "viagï¿½bamos": "viagábamos",
          "viï¿½jabamos": "viájabamos",
          "esconderï¿½": "esconderé",
          "escondï¿½re": "escondére",
          "ï¿½scondere": "éscondere",
          "apetitï¿½sa": "apetitósa",
          "furiï¿½so": "furióso",
          "ï¿½lgebra": "álgebra",
          "ï¿½ljebra": "áljebra",
          "algï¿½bra": "algébra",
          "divï¿½n": "diván",
          "dibï¿½n": "dibán",
          "dï¿½van": "dívan",
          "ï¿½lixir": "élixir",
          "hazaï¿½a": "hazaña",
          "hasaï¿½a": "hasaña",
          "hï¿½zaï¿½a": "házaña",
          "jinï¿½te": "jinéte",
          "jï¿½nete": "jínete",
          "almacï¿½n": "almacén",
          "almasï¿½n": "almasén",
          "almazï¿½n": "almazén",
          "almï¿½cen": "almácen",
          "albï¿½rca": "albérca",
          "nï¿½car": "nácar",
          "nacï¿½r": "nacár",
          "ojalï¿½": "ojalá",
          "hojalï¿½": "hojalá",
          "ï¿½jala": "ójala",
          "gï¿½itarra": "güitarra",
          "guï¿½tarra": "guítarra",
          "tarï¿½ma": "taríma",
          "tï¿½rima": "tárima",
          "bï¿½renjena": "bérenjena",
          "zanï¿½horia": "zanáhoria",
          "barriï¿½": "barrió",
          "gabï¿½n": "gabán",
          "gï¿½ban": "gában",
          "jazmï¿½n": "jazmín",
          "jasmï¿½n": "jasmín",
          "jï¿½zmin": "jázmin",
          "baï¿½o": "baño",
          "baï¿½io": "bañio",
          "zafrï¿½": "zafrá",
          "zï¿½fra": "záfra",
          "combinaciï¿½n": "combinación",
          "conbinaciï¿½n": "conbinación",
          "combinasiï¿½n": "combinasión",
          "combinacï¿½on": "combinacíon",
          "proviï¿½ne": "proviéne",
          "combï¿½tir": "combátir",
          "congestiï¿½n": "congestión",
          "conjestiï¿½n": "conjestión",
          "comgestiï¿½n": "comgestión",
          "congestï¿½on": "congestíon",
          "confraternï¿½r": "confraternár",
          "prosï¿½guir": "proséguir",
          "confirmaciï¿½n": "confirmación",
          "confirmasiï¿½n": "confirmasión",
          "comfirmaciï¿½n": "comfirmación",
          "confirmacï¿½on": "confirmacíon",
          "componï¿½r": "componér",
          "cï¿½mponer": "cómponer",
          "comparï¿½r": "comparár",
          "cï¿½mparar": "cómparar",
          "epï¿½dermis": "epídermis",
          "compartï¿½r": "compartír",
          "compï¿½rtir": "compártir",
          "promï¿½ver": "promóver",
          "epï¿½centro": "epícentro",
          "compï¿½dre": "compádre",
          "compadrï¿½": "compadré",
          "consegï¿½ir": "consegüir",
          "consï¿½guir": "conséguir",
          "proclamï¿½r": "proclamár",
          "proclï¿½mar": "proclámar",
          "sï¿½perabundancia": "súperabundancia",
          "semicï¿½rculo": "semicírculo",
          "semisï¿½rculo": "semisírculo",
          "semicircï¿½lo": "semicircúlo",
          "superdotï¿½do": "superdotádo",
          "sï¿½perdotado": "súperdotado",
          "antiï¿½cido": "antiácido",
          "antiï¿½sido": "antiásido",
          "antiacï¿½do": "antiacído",
          "sï¿½perponer": "súperponer",
          "supervisiï¿½n": "supervisión",
          "superviciï¿½n": "supervición",
          "supervisï¿½on": "supervisíon",
          "antibiï¿½tico": "antibiótico",
          "antebiï¿½tico": "antebiótico",
          "antibiotï¿½co": "antibiotíco",
          "sï¿½perpoblado": "súperpoblado",
          "anticonstï¿½tucional": "anticonstítucional",
          "sobreactuï¿½r": "sobreactuár",
          "sobrecargï¿½": "sobrecargá",
          "semiolvidï¿½do": "semiolvidádo",
          "sobrehumanï¿½": "sobrehumanó",
          "semiacï¿½bado": "semiacábado",
          "sobrenï¿½mbre": "sobrenómbre",
          "sobrenombrï¿½": "sobrenombré",
          "semidï¿½sierto": "semidésierto",
          "sï¿½bremesa": "sóbremesa",
          "anticuï¿½rpo": "anticuérpo",
          "subterrï¿½neo": "subterráneo",
          "subterranï¿½o": "subterranéo",
          "subï¿½ltero": "subáltero",
          "subdï¿½rector": "subdírector",
          "subrï¿½yar": "subráyar",
          "subgrupï¿½": "subgrupó",
          "translï¿½cido": "translúcido",
          "traslï¿½cido": "traslúcido",
          "translï¿½sido": "translúsido",
          "trï¿½nslucido": "tránslucido",
          "subtï¿½tulo": "subtítulo",
          "sutï¿½tulo": "sutítulo",
          "subtitï¿½lo": "subtitúlo",
          "subdividï¿½r": "subdividír",
          "subestimï¿½r": "subestimár",
          "subï¿½stimar": "subéstimar",
          "fotï¿½grafo": "fotógrafo",
          "fotï¿½grefo": "fotógrefo",
          "fï¿½tografo": "fótografo",
          "microbï¿½s": "microbús",
          "microbï¿½z": "microbúz",
          "mï¿½crobus": "mícrobus",
          "telï¿½scopio": "teléscopio",
          "televisiï¿½n": "televisión",
          "televiziï¿½n": "televizión",
          "televiciï¿½n": "televición",
          "telï¿½vision": "telévision",
          "micrï¿½ondas": "micróondas",
          "autï¿½grafo": "autógrafo",
          "ahutï¿½grafo": "ahutógrafo",
          "ï¿½utografo": "áutografo",
          "telï¿½grama": "telégrama",
          "micrï¿½segundo": "micrósegundo",
          "cinematï¿½grafo": "cinematógrafo",
          "sinematï¿½grafo": "sinematógrafo",
          "cinemï¿½tografo": "cinemátografo",
          "microcirugï¿½a": "microcirugía",
          "microsirugï¿½a": "microsirugía",
          "microcirujï¿½a": "microcirujía",
          "micrï¿½cirugia": "micrócirugia",
          "micrï¿½scopio": "micróscopio",
          "telï¿½spectador": "teléspectador",
          "grafologï¿½a": "grafología",
          "grafolojï¿½a": "grafolojía",
          "grafelogï¿½a": "grafelogía",
          "grafï¿½logia": "grafólogia",
          "bibliï¿½grafo": "bibliógrafo",
          "bivliï¿½grafo": "bivliógrafo",
          "bisbliï¿½grafo": "bisbliógrafo",
          "bibliï¿½grafo": "bibliógrafo",
          "microcï¿½nta": "microcínta",
          "telï¿½grafo": "telégrafo",
          "telï¿½grafo": "telógrafo",
          "tï¿½legrafo": "télegrafo",
          "microclï¿½ma": "microclíma",
          "radiotelefonï¿½a": "radiotelefonía",
          "radiotelofononï¿½a": "radiotelofononía",
          "radiotï¿½lefonia": "radiotélefonia",
          "audiciï¿½n": "audición",
          "audisiï¿½n": "audisión",
          "audiziï¿½n": "audizión",
          "ï¿½udision": "áudision",
          "auditï¿½rio": "auditório",
          "ï¿½udio": "áudio",
          "audiï¿½": "audió",
          "inï¿½udible": "ináudible",
          "audiometrï¿½a": "audiometría",
          "ahudiometrï¿½a": "ahudiometría",
          "audiomï¿½tria": "audiométria",
          "abrï¿½pto": "abrúpto",
          "ruptï¿½ra": "ruptúra",
          "interruptï¿½r": "interruptór",
          "exï¿½brupto": "exábrupto",
          "descrï¿½bir": "descríbir",
          "inscribï¿½r": "inscribír",
          "manuscrï¿½be": "manuscríbe",
          "aspï¿½cto": "aspécto",
          "respï¿½cto": "respécto",
          "espectï¿½culo": "espectáculo",
          "expectï¿½culo": "expectáculo",
          "ecspectï¿½culo": "ecspectáculo",
          "ï¿½spectaculo": "éspectaculo",
          "inspecciï¿½n": "inspección",
          "inspexiï¿½n": "inspexión",
          "inspecsiï¿½n": "inspecsión",
          "inspeccï¿½on": "inspeccíon",
          "ï¿½nspector": "ínspector",
          "erupciï¿½n": "erupción",
          "erucciï¿½n": "erucción",
          "erucsiï¿½n": "erucsión",
          "ojeï¿½r": "ojeár",
          "ojï¿½ar": "ojéar",
          "hogeï¿½r": "hogeár",
          "hojï¿½ar": "hojéar",
          "tambiï¿½n": "también",
          "tanbiï¿½n": "tanbién",
          "tï¿½mbien": "támbien",
          "tan biï¿½n": "tan bién",
          "hï¿½ber": "háber",
          "ha vï¿½r": "ha vér",
          "avï¿½r": "avér",
          "asimï¿½smo": "asimísmo",
          "asï¿½mismo": "asímismo",
          "ï¿½simismo": "ásimismo",
          "a sï¿½ mismo": "a sí mismo",
          "ï¿½ si mismo": "á si mismo",
          "sï¿½no": "síno",
          "sinï¿½": "sinó",
          "sï¿½ no": "sí no",
          "si nï¿½": "si nó",
          "tampï¿½co": "tampóco",
          "tï¿½mpoco": "támpoco",
          "tam pï¿½co": "tam póco",
          "tï¿½n poco": "tán poco",
          "hï¿½cho": "hécho",
          "hï¿½hco": "héhco",
          "ï¿½cho": "écho",
          "porqï¿½": "porqé",
          "porqiï¿½": "porqié",
          "por quï¿½": "por qué",
          "pï¿½r quï¿½": "pór qué",
          "pï¿½r que": "pór que",
          "reusï¿½r": "reusár",
          "reuhsï¿½r": "reuhsár",
          "rehï¿½sar": "rehúsar",
          "reï¿½sar": "reúsar",
          "reusï¿½r": "reusár",
          "rï¿½usar": "réusar",
          "en tï¿½rno": "en tórno",
          "ï¿½n torno": "én torno",
          "entï¿½rno": "entórno",
          "ï¿½ntorno": "éntorno",
          "composiciï¿½n": "composición",
          "compociciï¿½n": "compocición",
          "composisiï¿½n": "composisión",
          "composicï¿½on": "composicíon",
          "escenï¿½rio": "escenário",
          "excï¿½ntrico": "excéntrico",
          "exï¿½ntrico": "exéntrico",
          "eccï¿½ntrico": "eccéntrico",
          "fï¿½scinar": "fáscinar",
          "agï¿½jero": "agújero",
          "bohï¿½mio": "bohémio",
          "calï¿½bozo": "calábozo",
          "exchï¿½bir": "exchíbir",
          "pï¿½scuezo": "péscuezo",
          "enhï¿½brar": "enhébrar",
          "grisï¿½ceo": "grisáceo",
          "grisï¿½seo": "grisáseo",
          "grizï¿½ceo": "grizáceo",
          "hï¿½bitat": "hábitat",
          "hï¿½bitad": "hábitad",
          "habitï¿½t": "habitát",
          "hï¿½billa": "hébilla",
          "higiï¿½nico": "higiénico",
          "higï¿½nico": "higénico",
          "hijiï¿½nico": "hijiénico",
          "hipï¿½tesis": "hipótesis",
          "hipï¿½tecis": "hipótecis",
          "ipï¿½tesis": "ipótesis",
          "lombrï¿½z": "lombríz",
          "relojï¿½ro": "relojéro",
          "extermï¿½nador": "extermínador",
          "pï¿½sajero": "pásajero",
          "mï¿½sero": "mésero",
          "carpintï¿½ra": "carpintéra",
          "hormigï¿½ero": "hormigüero",
          "hï¿½rmiguero": "hórmiguero",
          "nï¿½dador": "nádador",
          "remï¿½lcador": "remólcador",
          "despertadï¿½r": "despertadór",
          "despï¿½rtador": "despértador",
          "operadï¿½ra": "operadóra",
          "opï¿½radora": "opéradora",
          "limonï¿½ro": "limonéro",
          "limï¿½nero": "limónero",
          "cochï¿½ra": "cochéra",
          "reparadï¿½ra": "reparadóra",
          "contadï¿½r": "contadór",
          "diseï¿½adora": "diseñadora",
          "deseï¿½adora": "deseñadora",
          "diseï¿½ï¿½dor": "diseñádor",
          "licuadï¿½ra": "licuadóra",
          "licuï¿½dora": "licuádora",
          "calculadï¿½ra": "calculadóra",
          "cï¿½lculadora": "cálculadora",
          "costurï¿½ra": "costuréra",
          "cï¿½sturera": "cósturera",
          "iingenï¿½era": "iingeníera",
          "ï¿½samblea": "ásamblea",
          "bï¿½nquete": "bánquete",
          "cï¿½bina": "cábina",
          "detï¿½lle": "detálle",
          "dï¿½talle": "détalle",
          "chofï¿½r": "chofér",
          "chï¿½fer": "chófer",
          "bebï¿½": "bebé",
          "bevï¿½": "bevé",
          "biebï¿½": "biebé",
          "departamï¿½nto": "departaménto",
          "chï¿½f": "chéf",
          "etï¿½pa": "etápa",
          "flï¿½cha": "flécha",
          "flechï¿½": "flechá",
          "carnï¿½": "carné",
          "carnï¿½d": "carnéd",
          "karnï¿½": "karné",
          "jardï¿½n": "jardín",
          "gardï¿½n": "gardín",
          "jï¿½rdin": "járdin",
          "chaquï¿½ta": "chaquéta",
          "chï¿½queta": "cháqueta",
          "merengï¿½e": "merengüe",
          "mï¿½rengue": "mérengue",
          "nortï¿½": "norté",
          "pantalï¿½n": "pantalón",
          "pantï¿½lon": "pantálon",
          "pï¿½ntalon": "pántalon",
          "aviï¿½n": "avión",
          "haviï¿½n": "havión",
          "ï¿½vion": "ávion",
          "bï¿½jito": "bájito",
          "viï¿½jita": "viéjita",
          "pokitï¿½co": "pokitíco",
          "pï¿½quitico": "póquitico",
          "ratï¿½to": "ratíto",
          "pequeï¿½ita": "pequeñita",
          "pekeï¿½ita": "pekeñita",
          "pequeï¿½itia": "pequeñitia",
          "gatï¿½ta": "gatíta",
          "pisotï¿½n": "pisotón",
          "pizotï¿½n": "pizotón",
          "pisï¿½ton": "pisóton",
          "taconï¿½zo": "taconázo",
          "zapatï¿½nes": "zapatónes",
          "zapatonï¿½s": "zapatonés",
          "respondï¿½n": "respondón",
          "rezpondï¿½n": "rezpondón",
          "respï¿½ndon": "respóndon",
          "grandï¿½te": "grandóte",
          "pelotï¿½zo": "pelotázo",
          "botellï¿½n": "botellón",
          "boteyï¿½n": "boteyón",
          "bï¿½tellon": "bótellon",
          "golï¿½zo": "golázo",
          "golazï¿½": "golazó",
          "golpetï¿½zo": "golpetázo",
          "gï¿½lpetazo": "gólpetazo",
          "grandulï¿½n": "grandulón",
          "grandï¿½lon": "grandúlon",
        };
        return (
          (a = a in o ? o[a] : a),
          (a = a.toLowerCase()),
          (a = a.replace("'", "")),
          (a = a.replace(".", "")),
          (a = a.replace(".", "")),
          (a = a.replace("'", "")),
          (a = a.replace(/ñ/g, "n")),
          (a = a.replace(/á/g, "a")),
          (a = a.replace(/ú/g, "u")),
          (a = a.replace(/í/g, "i")),
          (a = a.replace(/é/g, "e")),
          (a = a.replace(/ó/g, "o")),
          (a = a.replace(/ü/g, "u")),
          (a = a.replace(/ /g, "_")),
          "Homophones" ==
            e.levelGroups[e.currentLevelGroup][e.currentLevel].rule &&
            (a += "_example"),
          (a += ".mp3"),
          "assets/audios/words/g" + L + "/" + e.language + "/" + a
        );
      }
      function c(a) {
        var o = {
          "Palabras de ortografï¿½a": "Palabras de ortografía",
          "Mayï¿½s": "Mayús",
          capNÑ: "Ñ",
          "capNï¿½": "Ñ",
          capAÁ: "Á",
          "capAï¿½": "Á",
          capEÉ: "É",
          "capEï¿½": "É",
          capIÍ: "Í",
          "capIï¿½": "Í",
          capOÓ: "Ó",
          "capOï¿½": "Ó",
          capUÚ: "Ú",
          "capUï¿½": "Ú",
          capUUÜ: "Ü",
          "capUUï¿½": "Ü",
          smallnñ: "ñ",
          "smallnï¿½": "ñ",
          smallaá: "á",
          "smallaï¿½": "á",
          smalleé: "é",
          "smalleï¿½": "é",
          smallií: "í",
          "smalliï¿½": "í",
          smalloó: "ó",
          "smalloï¿½": "ó",
          smalluú: "ú",
          "smalluï¿½": "ú",
          smalluuü: "ü",
          "smalluuï¿½": "ü",
          "cafï¿½": "café",
          "trampolï¿½n": "trampolín",
          "trampollï¿½n": "trampollín",
          "floristerï¿½a": "floristería",
          "florï¿½steria": "florísteria",
          "ajï¿½": "ají",
          "agï¿½": "agí",
          "agitaciï¿½n": "agitación",
          "ajitaciï¿½n": "ajitación",
          "construï¿½": "construí",
          "construyï¿½": "construyí",
          "costruï¿½": "costruí",
          "mediodï¿½a": "mediodía",
          "mediadï¿½a": "mediadía",
          "telaraï¿½a": "telaraña",
          "telaaraï¿½a": "telaaraña",
          "teleraï¿½a": "teleraña",
          "dï¿½a": "día",
          "grï¿½a": "grúa",
          "gurï¿½a": "gurúa",
          "proteï¿½na": "proteína",
          "protoï¿½na": "protoína",
          "reï¿½": "reí",
          "rehï¿½": "rehí",
          "maï¿½z": "maíz",
          "maï¿½s": "maís",
          "paï¿½s": "país",
          "paï¿½z": "paíz",
          "envï¿½o": "envío",
          "henvï¿½o": "henvío",
          "gentï¿½o": "gentío",
          "jentï¿½o": "jentío",
          "baï¿½l": "baúl",
          "bahï¿½l": "bahúl",
          "desilusiï¿½n": "desilusión",
          "desiluciï¿½n": "desilución",
          "asï¿½": "así",
          "acï¿½": "ací",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "cï¿½men": "cómen",
          "comï¿½n": "comén",
          "ganï¿½": "ganó",
          "gï¿½no": "gáno",
          "apï¿½nas": "apénas",
          "ï¿½penas": "ápenas",
          "canciï¿½n": "canción",
          "cï¿½ncion": "cáncion",
          "tesï¿½ro": "tesóro",
          "tesorï¿½": "tesoró",
          "detrï¿½s": "detrás",
          "dï¿½tras": "détras",
          "valï¿½r": "valór",
          "vï¿½lor": "válor",
          "fï¿½cil": "fácil",
          "facï¿½l": "facíl",
          "ï¿½guila": "águila",
          "aguï¿½la": "aguíla",
          "brï¿½jula": "brújula",
          "brujulï¿½": "brujulá",
          "cientï¿½fico": "científico",
          "ciï¿½ntifico": "ciéntifico",
          "dï¿½cada": "década",
          "decï¿½da": "decáda",
          "quï¿½taselo": "quítaselo",
          "quitasï¿½lo": "quitasélo",
          "levï¿½ntate": "levántate",
          "levantï¿½te": "levantáte",
          "murciï¿½lago": "murciélago",
          "murcielï¿½go": "murcielágo",
          "sï¿½bado": "sábado",
          "sabï¿½do": "sabádo",
          "entrï¿½gamelo": "entrégamelo",
          "entregï¿½melo": "entregámelo",
          "ï¿½nico": "único",
          "unï¿½co": "uníco",
          "bï¿½ho": "búho",
          "bï¿½o": "búo",
          "vehï¿½culo": "vehículo",
          "veï¿½culo": "veículo",
          "bahï¿½a": "bahía",
          "baï¿½a": "baía",
          "ahijï¿½do": "ahijádo",
          "helï¿½do": "heládo",
          "hoguï¿½ra": "hoguéra",
          "ahorrï¿½r": "ahorrár",
          "ahumï¿½r": "ahumár",
          "ï¿½tiles": "útiles",
          "jï¿½ntos": "júntos",
          "lï¿½pices": "lápices",
          "lï¿½picez": "lápicez",
          "lï¿½pizez": "lápizez",
          "camiï¿½n": "camión",
          "cï¿½mion": "cámion",
          "marï¿½timo": "marítimo",
          "marï¿½stimo": "marístimo",
          "demï¿½s": "demás",
          "demï¿½z": "demáz",
          "aï¿½reo": "aéreo",
          "ï¿½ereo": "áereo",
          "ganï¿½do": "ganádo",
          "pingï¿½ino": "pingüino",
          "pengï¿½ino": "pengüino",
          "desagï¿½e": "desagüe",
          "bilingï¿½e": "bilingüe",
          "algï¿½nos": "algünos",
          "niï¿½ez": "niñez",
          "niï¿½es": "niñes",
          "bondï¿½": "bondá",
          "mirarï¿½": "miraré",
          "merarï¿½": "meraré",
          "jugï¿½": "jugó",
          "jï¿½go": "júgo",
          "cambiï¿½": "cambió",
          "cï¿½mbio": "cámbio",
          "escribï¿½": "escribé",
          "saltï¿½": "saltó",
          "sï¿½lto": "sálto",
          "cambiï¿½": "cambió",
          "cï¿½mbio": "cámbio",
          "volverï¿½": "volveré",
          "volvï¿½re": "volvére",
          "serï¿½": "seré",
          "sï¿½re": "sére",
          "saltï¿½": "salté",
          "sï¿½lte": "sálte",
          "votarï¿½": "votaré",
          "votï¿½re": "votáre",
          "ï¿½l": "él",
          "hï¿½l": "hél",
          "ï¿½l": "él",
          "sï¿½": "sí",
          "cï¿½": "cí",
          "mï¿½": "mí",
          "quï¿½": "qué",
          "qï¿½": "qé",
          "quï¿½": "qué",
          "cï¿½mo": "cómo",
          "kï¿½mo": "kómo",
          "sï¿½is": "séis",
          "difï¿½cil": "difícil",
          "difï¿½sil": "difísil",
          "avanzï¿½": "avanzó",
          "avansï¿½": "avansó",
          "narï¿½z": "naríz",
          "sï¿½mbolo": "símbolo",
          "sï¿½nbolo": "sínbolo",
          "sï¿½mvolo": "símvolo",
          "compï¿½s": "compás",
          "conpï¿½s": "conpás",
          "compï¿½z": "compáz",
          "sonreï¿½do": "sonreído",
          "somreï¿½do": "somreído",
          "traï¿½do": "traído",
          "trahï¿½do": "trahído",
          "aï¿½reo": "aéreo",
          "aï¿½rio": "aério",
          "hï¿½roe": "héroe",
          "hï¿½rue": "hérue",
          "camaleï¿½n": "camaleón",
          "kamaleï¿½n": "kamaleón",
          "aereolï¿½nea": "aereolínea",
          "aereolï¿½nea": "aereolínea",
          "poesï¿½a": "poesía",
          "puesï¿½a": "puesía",
          "geï¿½grafo": "geógrafo",
          "jeï¿½grafo": "jeógrafo",
          "canï¿½a": "canúa",
          "pasï¿½a": "pasía",
          "biografï¿½a": "biografía",
          "viografï¿½a": "viografía",
          "actï¿½a": "actúa",
          "hactï¿½a": "hactúa",
          "sonreï¿½rse": "sonreírse",
          "sonrreï¿½rse": "sonrreírse",
          "maï¿½z": "maíz",
          "maï¿½s": "maís",
          "sabï¿½a": "sabía",
          "savï¿½a": "savía",
          "habï¿½a": "había",
          "havï¿½a": "havía",
          "rï¿½o": "río",
          "rrï¿½o": "rrío",
          "recaï¿½da": "recaída",
          "rrecaï¿½da": "rrecaída",
          "distraï¿½do": "distraído",
          "destraï¿½do": "destraído",
          "gentï¿½o": "gentío",
          "jentï¿½o": "jentío",
          "baï¿½l": "baúl",
          "vaï¿½l": "vaúl",
          "proteï¿½na": "proteína",
          "protenï¿½a": "protenía",
          "aï¿½lla": "aúlla",
          "aï¿½ya": "aúya",
          "garantï¿½a": "garantía",
          "garentï¿½a": "garentía",
          "bohï¿½o": "bohío",
          "vohï¿½o": "vohío",
          "cacatï¿½a": "cacatúa",
          "kakatï¿½a": "kakatúa",
          "Raï¿½l": "Raúl",
          "Marï¿½a": "María",
          "Marrï¿½a": "Marría",
          "baterï¿½a": "batería",
          "vaterï¿½a": "vatería",
          "mï¿½o": "mío",
          "mï¿½u": "míu",
          "inacciï¿½n": "inacción",
          "inaxiï¿½n": "inaxión",
          "sobreactuï¿½r": "sobreactuár",
          "sobresalï¿½r": "sobresalír",
          "subacuï¿½tico": "subacuático",
          "suvacuï¿½tico": "suvacuático",
          "subestaciï¿½n": "subestación",
          "suvestaciï¿½n": "suvestación",
          "imï¿½genes": "imágenes",
          "imï¿½jenes": "imájenes",
          "lï¿½pices": "lápices",
          "lï¿½pizes": "lápizes",
          "lï¿½pises": "lápises",
          "telï¿½fonos": "teléfonos",
          "telï¿½fones": "teléfones",
          "lugï¿½ares": "lugüares",
          "dï¿½adema": "díadema",
          "reuniï¿½n": "reunión",
          "riuniï¿½n": "riunión",
          "bï¿½isbol": "béisbol",
          "beisbï¿½l": "beisból",
          "vï¿½isbol": "véisbol",
          "ruï¿½nas": "ruínas",
          "ruï¿½do": "ruído",
          "fuï¿½": "fuí",
          "foï¿½": "foí",
          "incluï¿½do": "incluído",
          "ruiseï¿½or": "ruiseñor",
          "ruiceï¿½or": "ruiceñor",
          "intuiciï¿½n": "intuición",
          "intuisiï¿½n": "intuisión",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biografï¿½a": "biografía",
          "beografï¿½a": "beografía",
          "fonï¿½ma": "fonéma",
          "fonï¿½tica": "fonética",
          "fonï¿½tika": "fonétika",
          "polï¿½glota": "políglota",
          "pulï¿½glota": "pulíglota",
          "fonografï¿½a": "fonografía",
          "fonogrefï¿½a": "fonogrefía",
          "grï¿½fico": "gráfico",
          "grï¿½fiko": "gráfiko",
          "monolingï¿½e": "monolingüe",
          "monografï¿½a": "monografía",
          "monegrafï¿½a": "monegrafía",
          "grafologï¿½a": "grafología",
          "grafolojï¿½a": "grafolojía",
          "policï¿½falo": "policéfalo",
          "polisï¿½falo": "poliséfalo",
          "polï¿½gono": "polígono",
          "polï¿½gomo": "polígomo",
          "policromï¿½a": "policromía",
          "polikromï¿½a": "polikromía",
          "acuï¿½rio": "acuário",
          "acuï¿½tico": "acuático",
          "hacuï¿½tico": "hacuático",
          "acuanï¿½uta": "acuanáuta",
          "acuï¿½so": "acuóso",
          "acuarï¿½la": "acuaréla",
          "acuï¿½fero": "acuífero",
          "aquï¿½fero": "aquífero",
          "dicciï¿½n": "dicción",
          "dixiï¿½n": "dixión",
          "dicsiï¿½n": "dicsión",
          "dictï¿½do": "dictádo",
          "dictï¿½r": "dictár",
          "dictï¿½men": "dictámen",
          "edï¿½cto": "edícto",
          "veredï¿½cto": "veredícto",
          "dictaminï¿½r": "dictaminár",
          "dictadï¿½r": "dictadór",
          "aï¿½reo": "aéreo",
          "haï¿½reo": "haéreo",
          "ï¿½ire": "áire",
          "cï¿½mara": "cámara",
          "kï¿½mara": "kámara",
          "camarï¿½grafo": "camarógrafo",
          "camarogrï¿½fo": "camarográfo",
          "composiciï¿½n": "composición",
          "composisiï¿½n": "composisión",
          "fï¿½cil": "fácil",
          "fï¿½sil": "fásil",
          "imï¿½gen": "imágen",
          "imï¿½genes": "imágenes",
          "imï¿½jenes": "imájenes",
          "necesitarï¿½a": "necesitaría",
          "nececitarï¿½a": "nececitaría",
          "nesesitarï¿½a": "nesesitaría",
          "produxiï¿½n": "produxión",
          "producsiï¿½n": "producsión",
          "reï¿½ne": "reúne",
          "rreï¿½ne": "rreúne",
          "reuniï¿½n": "reunión",
          "rreuniï¿½n": "rreunión",
          "Panamï¿½": "Panamá",
          "Pamamï¿½": "Pamamá",
          "guaranï¿½": "guaraná",
          "waranï¿½": "waraná",
          "chimpancï¿½": "chimpancé",
          "chimpansï¿½": "chimpansé",
          "comitï¿½": "comité",
          "cometï¿½": "cometé",
          "jamï¿½s": "jamás",
          "jammï¿½s": "jammás",
          "ajonjolï¿½": "ajonjolí",
          "agonjolï¿½": "agonjolí",
          "colibrï¿½": "colibrí",
          "colivrï¿½": "colivrí",
          "conclusiï¿½n": "conclusión",
          "concluciï¿½n": "conclución",
          "acciï¿½n": "acción",
          "axiï¿½n": "axión",
          "acsiï¿½n": "acsión",
          "algodï¿½n": "algodón",
          "halgodï¿½n": "halgodón",
          "ademï¿½s": "además",
          "hademï¿½s": "hademás",
          "dï¿½bil": "débil",
          "dï¿½vil": "dévil",
          "ï¿½rbol": "árbol",
          "ï¿½rvol": "árvol",
          "fï¿½cil": "fácil",
          "fï¿½sil": "fásil",
          "cï¿½sped": "césped",
          "hï¿½bil": "hábil",
          "hï¿½vil": "hávil",
          "difï¿½cil": "difícil",
          "difï¿½sil": "difísil",
          "lï¿½piz": "lápiz",
          "lï¿½pis": "lápis",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "pï¿½ster": "póster",
          "pï¿½sster": "pósster",
          "reacciï¿½n": "reacción",
          "reaxiï¿½n": "reaxión",
          "reacsiï¿½n": "reacsión",
          "misiï¿½n": "misión",
          "miciï¿½n": "mición",
          "canciï¿½n": "canción",
          "cansiï¿½n": "cansión",
          "ilusiï¿½n": "ilusión",
          "iluciï¿½n": "ilución",
          "confusiï¿½n": "confusión",
          "confuciï¿½n": "confución",
          "dedicaciï¿½n": "dedicación",
          "dedicasiï¿½n": "dedicasión",
          "porciï¿½n": "porción",
          "porsiï¿½n": "porsión",
          "divisiï¿½n": "división",
          "diviciï¿½n": "divición",
          "tensiï¿½n": "tensión",
          "tenciï¿½n": "tención",
          "fusiï¿½n": "fusión",
          "fuciï¿½n": "fución",
          "presiï¿½n": "presión",
          "preciï¿½n": "preción",
          "protecciï¿½n": "protección",
          "protexiï¿½n": "protexión",
          "protecsiï¿½n": "protecsión",
          "mansiï¿½n": "mansión",
          "manciï¿½n": "manción",
          "profesiï¿½n": "profesión",
          "profeciï¿½n": "profeción",
          "posiciï¿½n": "posición",
          "posisiï¿½n": "posisión",
          "pociciï¿½n": "pocición",
          "direcciï¿½n": "dirección",
          "direxiï¿½n": "direxión",
          "direcsiï¿½n": "direcsión",
          "emociï¿½n": "emoción",
          "emosiï¿½n": "emosión",
          "hemosiï¿½n": "hemosión",
          "lociï¿½n": "loción",
          "losiï¿½n": "losión",
          "diversiï¿½n": "diversión",
          "diverciï¿½n": "diverción",
          "dibersiï¿½n": "dibersión",
          "estaciï¿½n": "estación",
          "estasiï¿½n": "estasión",
          "Mï¿½xico": "México",
          "lï¿½grimas": "lágrimas",
          "lï¿½gremas": "lágremas",
          "mï¿½sica": "música",
          "mï¿½sika": "músika",
          "vï¿½rtices": "vértices",
          "vï¿½rtises": "vértises",
          "dï¿½cada": "década",
          "dï¿½kada": "dékada",
          "rï¿½pido": "rápido",
          "rrï¿½pido": "rrápido",
          "pï¿½blico": "público",
          "pï¿½bliko": "públiko",
          "esdrï¿½jula": "esdrújula",
          "sdrï¿½jula": "sdrújula",
          "ï¿½ngulo": "ángulo",
          "ï¿½ngï¿½lo": "ángülo",
          "pï¿½jaro": "pájaro",
          "pï¿½garo": "págaro",
          "nï¿½madas": "nómadas",
          "nï¿½madas": "námadas",
          "recomiï¿½ndaselo": "recomiéndaselo",
          "recomiï¿½ndacelo": "recomiéndacelo",
          "vï¿½monos": "vámonos",
          "bï¿½monos": "bámonos",
          "llï¿½vaselo": "llévaselo",
          "llï¿½vacelo": "llévacelo",
          "pï¿½samelo": "pásamelo",
          "pï¿½zamelo": "pázamelo",
          "cuï¿½ntamela": "cuéntamela",
          "kuï¿½ntamela": "kuéntamela",
          "regï¿½lasela": "regálasela",
          "rejï¿½lasela": "rejálasela",
          "devuï¿½lvemelo": "devuélvemelo",
          "debuï¿½lvemelo": "debuélvemelo",
          "aprï¿½ndetela": "apréndetela",
          "aprendetelï¿½": "aprendetelá",
          "prï¿½stamelo": "préstamelo",
          "prestamelï¿½": "prestameló",
          "almohï¿½da": "almoháda",
          "ahogï¿½do": "ahogádo",
          "bahï¿½a": "bahía",
          "baï¿½a": "baía",
          "turbohï¿½lice": "turbohélice",
          "turbohï¿½lise": "turbohélise",
          "turvohï¿½lice": "turvohélice",
          "ahï¿½nco": "ahínco",
          "aï¿½nco": "aínco",
          "alcï¿½l": "alcól",
          "alchï¿½l": "alchól",
          "zoolï¿½gico": "zoológico",
          "zolï¿½gico": "zológico",
          "soolï¿½gico": "soológico",
          "prohï¿½ben": "prohíben",
          "proï¿½ben": "proíben",
          "prohï¿½ven": "prohíven",
          "vehï¿½culo": "vehículo",
          "veï¿½culo": "veículo",
          "releyï¿½": "releyó",
          "relellï¿½": "relelló",
          "releiï¿½": "releió",
          "antisï¿½smico": "antisísmico",
          "antesï¿½smico": "antesísmico",
          "antiï¿½cido": "antiácido",
          "anteï¿½cido": "anteácido",
          "antiï¿½sido": "antiásido",
          "antiatï¿½mico": "antiatómico",
          "anteatï¿½mico": "anteatómico",
          "reagrupï¿½": "reagrupó",
          "regrupï¿½": "regrupó",
          "dormirï¿½s": "dormirás",
          "caminarï¿½": "caminaré",
          "camimarï¿½": "camimaré",
          "saldrï¿½amos": "saldríamos",
          "zaldrï¿½amos": "zaldríamos",
          "visitarï¿½s": "visitarás",
          "vicitarï¿½s": "vicitarás",
          "mirarï¿½": "miraré",
          "mirrarï¿½": "mirraré",
          "verï¿½s": "verás",
          "berï¿½s": "berás",
          "comerï¿½an": "comerían",
          "komerï¿½an": "komerían",
          "estarï¿½n": "estarán",
          "eztarï¿½n": "eztarán",
          "pasï¿½bamos": "pasábamos",
          "pasï¿½vamos": "pasávamos",
          "comï¿½": "comí",
          "komï¿½": "komí",
          "volverï¿½n": "volverán",
          "volberï¿½n": "volberán",
          "podrï¿½s": "podrás",
          "podrï¿½z": "podráz",
          "dï¿½bamos": "dábamos",
          "saltarï¿½a": "saltaría",
          "zaltarï¿½a": "zaltaría",
          "nadarï¿½a": "nadaría",
          "nadï¿½ria": "nadária",
          "trabajï¿½": "trabajó",
          "trabï¿½jo": "trabájo",
          "pasï¿½": "pasó",
          "pï¿½so": "páso",
          "ï¿½bamos": "íbamos",
          "ï¿½vamos": "ívamos",
          "cultivarï¿½a": "cultivaría",
          "cultibarï¿½a": "cultibaría",
          "fuï¿½ramos": "fuéramos",
          "fuerï¿½mos": "fuerámos",
          "fonometrï¿½a": "fonometría",
          "fonemetrï¿½a": "fonemetría",
          "fonï¿½tica": "fonética",
          "fonï¿½tica": "fonótica",
          "microbï¿½s": "microbús",
          "mecrobï¿½s": "mecrobús",
          "perï¿½metro": "perímetro",
          "pirï¿½metro": "pirímetro",
          "megï¿½fono": "megáfono",
          "meguï¿½fono": "meguáfono",
          "megalï¿½polis": "megalópolis",
          "megualï¿½polis": "megualópolis",
          "telï¿½fono": "teléfono",
          "tilï¿½fono": "tiléfono",
          "micrï¿½fono": "micrófono",
          "mecrï¿½fono": "mecrófono",
          "anglï¿½fono": "anglófono",
          "botï¿½r": "botár",
          "votï¿½r": "votár",
          "hï¿½cho": "hécho",
          "ï¿½cho": "écho",
          "cï¿½llo": "cállo",
          "cï¿½yo": "cáyo",
          "hï¿½la": "hóla",
          "ï¿½la": "óla",
          "hï¿½ndas": "hóndas",
          "ï¿½ndas": "óndas",
          "ï¿½sta": "ásta",
          "hï¿½sta": "hásta",
          "tï¿½bo": "túbo",
          "tï¿½vo": "túvo",
          "cosï¿½r": "cosér",
          "cocï¿½r": "cocér",
          "portï¿½til": "portátil",
          "portï¿½tel": "portátel",
          "portï¿½ro": "portéro",
          "aportï¿½r": "aportár",
          "portï¿½da": "portáda",
          "genealogï¿½a": "genealogía",
          "genealojï¿½a": "genealojía",
          "genialogï¿½a": "genialogía",
          "generaciï¿½n": "generación",
          "jeneraciï¿½n": "jeneración",
          "generasiï¿½n": "generasión",
          "generï¿½l": "generál",
          "generï¿½r": "generár",
          "duraciï¿½n": "duración",
          "durasiï¿½n": "durasión",
          "duraziï¿½n": "durazión",
          "durï¿½za": "duréza",
          "duradï¿½ro": "duradéro",
          "proyï¿½cto": "proyécto",
          "proyectï¿½r": "proyectór",
          "trayï¿½cto": "trayécto",
          "inyectï¿½r": "inyectár",
          "genï¿½tica": "genética",
          "jenï¿½tica": "jenética",
          "regenerï¿½r": "regenerár",
          "temprï¿½no": "tempráno",
          "contramï¿½no": "contramáno",
          "humï¿½no": "humáno",
          "lozï¿½na": "lozána",
          "andinï¿½smo": "andinísmo",
          "naturalï¿½sta": "naturalísta",
          "pianï¿½sta": "pianísta",
          "aï¿½n": "aún",
          "haï¿½n": "haún",
          "ahï¿½n": "ahún",
          "dï¿½": "dé",
          "ddï¿½": "ddé",
          "dï¿½e": "dée",
          "hï¿½l": "hél",
          "mï¿½s": "más",
          "mmï¿½s": "mmás",
          "mï¿½as": "máas",
          "mï¿½i": "míi",
          "mmï¿½": "mmí",
          "sï¿½": "sé",
          "sï¿½e": "sée",
          "ssï¿½": "ssí",
          "sï¿½i": "síi",
          "tï¿½": "té",
          "ttï¿½": "tté",
          "tï¿½e": "tée",
          "tï¿½": "tú",
          "tï¿½u": "túu",
          "ttï¿½": "ttú",
          "quï¿½": "qué",
          "quuï¿½": "quué",
          "quï¿½e": "quée",
          "excï¿½ntrico": "excéntrico",
          "exï¿½ntrico": "exéntrico",
          "exsï¿½ntrico": "exséntrico",
          "posmodï¿½rno": "posmodérno",
          "biaï¿½ual": "biañual",
          "biangï¿½lar": "biangülar",
          "triï¿½ngulo": "triángulo",
          "triï¿½ngï¿½lo": "triángülo",
          "triatlï¿½n": "triatlón",
          "trisatlï¿½n": "trisatlón",
          "transacciï¿½n": "transacción",
          "transacsiï¿½n": "transacsión",
          "transaciï¿½n": "transación",
          "televisiï¿½n": "televisión",
          "televiciï¿½n": "televición",
          "telecomunicaciï¿½n": "telecomunicación",
          "telecomunicasiï¿½n": "telecomunicasión",
          "telefonï¿½a": "telefonía",
          "telfonï¿½a": "telfonía",
          "fotografï¿½a": "fotografía",
          "fotogrefï¿½a": "fotogrefía",
          "biografï¿½a": "biografía",
          "bigrafï¿½a": "bigrafía",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "metrologï¿½a": "metrología",
          "metrolojï¿½a": "metrolojía",
          "metrilogï¿½a": "metrilogía",
          "fonï¿½grafo": "fonógrafo",
          "fonogrï¿½fo": "fonográfo",
          "telepatï¿½a": "telepatía",
          "telpatï¿½a": "telpatía",
          "telefï¿½rico": "teleférico",
          "telesfï¿½rico": "telesférico",
          "biomï¿½trico": "biométrico",
          "bimï¿½trico": "bimétrico",
          "termï¿½metro": "termómetro",
          "termomï¿½tro": "termométro",
          "cronï¿½metro": "cronómetro",
          "cronomï¿½tro": "cronométro",
          "apï¿½grafo": "apógrafo",
          "apogrï¿½fo": "apográfo",
          "psicologï¿½a": "psicología",
          "psicolojï¿½a": "psicolojía",
          "psicolï¿½gia": "psicológia",
          "favoritï¿½smo": "favoritísmo",
          "favoritï¿½smo": "favoritísmo",
          "aï¿½robismo": "aérobismo",
          "abolicionï¿½sta": "abolicionísta",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biolï¿½gia": "biológia",
          "realï¿½smo": "realísmo",
          "automovilï¿½smo": "automovilísmo",
          "realï¿½sta": "realísta",
          "reï¿½lista": "reálista",
          "tecnologï¿½a": "tecnología",
          "tecnolojï¿½a": "tecnolojía",
          "tecnolï¿½gia": "tecnológia",
          "modï¿½smo": "modísmo",
          "analï¿½sta": "analísta",
          "anï¿½lista": "análista",
          "meteorologï¿½a": "meteorología",
          "meteorolojï¿½a": "meteorolojía",
          "meteorï¿½logia": "meteorólogia",
          "cï¿½vismo": "cívismo",
          "ecologï¿½a": "ecología",
          "ecolojï¿½a": "ecolojía",
          "ecï¿½logia": "ecólogia",
          "racï¿½smo": "racísmo",
          "mitologï¿½a": "mitología",
          "mitolojï¿½a": "mitolojía",
          "mitï¿½logia": "mitólogia",
          "optimï¿½sta": "optimísta",
          "conservasionismï¿½": "conservasionismó",
          "antropologï¿½a": "antropología",
          "antropolojï¿½a": "antropolojía",
          "antrï¿½pologia": "antrópologia",
          "cronologï¿½a": "cronología",
          "cronolojï¿½a": "cronolojía",
          "crï¿½nologia": "crónologia",
          "kilï¿½metro": "kilómetro",
          "quilï¿½metro": "quilómetro",
          "kilomï¿½tro": "kilométro",
          "fotografï¿½a": "fotografía",
          "fotogrï¿½fia": "fotográfia",
          "geologï¿½a": "geología",
          "jeologï¿½a": "jeología",
          "geolojï¿½a": "geolojía",
          "geolï¿½gia": "geológia",
          "cronolï¿½gico": "cronológico",
          "cronolï¿½jico": "cronolójico",
          "cronï¿½logia": "cronólogia",
          "centï¿½metro": "centímetro",
          "sentï¿½metro": "sentímetro",
          "centimï¿½tro": "centimétro",
          "neoclï¿½sico": "neoclásico",
          "nï¿½oclasico": "néoclasico",
          "geï¿½logo": "geólogo",
          "jeï¿½logo": "jeólogo",
          "geolï¿½go": "geológo",
          "crï¿½nico": "crónico",
          "cronï¿½co": "croníco",
          "cronicï¿½": "cronicó",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biolï¿½gia": "biológia",
          "neolï¿½tico": "neolítico",
          "nï¿½olitico": "néolitico",
          "neolitï¿½co": "neolitíco",
          "geografï¿½a": "geografía",
          "jeografï¿½a": "jeografía",
          "geogrï¿½fia": "geográfia",
          "fotogï¿½nica": "fotogénica",
          "fotojï¿½nica": "fotojénica",
          "fotï¿½genica": "fotógenica",
          "termï¿½metro": "termómetro",
          "tï¿½rmometro": "térmometro",
          "termomï¿½tro": "termométro",
          "fotosï¿½ntesis": "fotosíntesis",
          "fotocï¿½ntesis": "fotocíntesis",
          "fotosintï¿½sis": "fotosintésis",
          "geometrï¿½a": "geometría",
          "jeometrï¿½a": "jeometría",
          "geomï¿½tria": "geométria",
          "sincrï¿½nizar": "sincrónizar",
          "perï¿½metro": "perímetro",
          "perimï¿½tro": "perimétro",
          "fotoelï¿½ctrico": "fotoeléctrico",
          "fotolï¿½ctrico": "fotoléctrico",
          "fotoelectrï¿½co": "fotoelectríco",
          "geomï¿½trico": "geométrico",
          "jeomï¿½trico": "jeométrico",
          "ï¿½ire": "áire",
          "caï¿½sa": "caúsa",
          "acï¿½ite": "acéite",
          "dï¿½uda": "déuda",
          "deudï¿½": "deudá",
          "trapezï¿½ide": "trapezóide",
          "trapezoï¿½de": "trapezoíde",
          "lï¿½mpia": "límpia",
          "limpï¿½a": "limpía",
          "virrï¿½y": "virréy",
          "buï¿½y": "buéy",
          "miï¿½u": "miáu",
          "violï¿½n": "violín",
          "biolï¿½n": "biolín",
          "veolï¿½n": "veolín",
          "poï¿½ma": "poéma",
          "poemï¿½": "poemá",
          "Uruguï¿½y": "Uruguáy",
          "patalï¿½a": "pataléa",
          "pataleï¿½": "pataleá",
          "diciï¿½mbre": "diciémbre",
          "cualidï¿½d": "cualidád",
          "mediï¿½na": "mediána",
          "medianï¿½": "medianá",
          "guayï¿½ba": "guayába",
          "aguacerï¿½": "aguaceró",
          "audï¿½ble": "audíble",
          "detalladamï¿½nte": "detalladaménte",
          "detallï¿½damente": "detalládamente",
          "rï¿½pidamente": "rápidamente",
          "rapidamï¿½nte": "rapidaménte",
          "rapidï¿½mente": "rapidámente",
          "completï¿½mente": "completámente",
          "difï¿½cilmente": "difícilmente",
          "difï¿½silmente": "difísilmente",
          "dificilmï¿½nte": "dificilménte",
          "cuidadï¿½samente": "cuidadósamente",
          "cuidadosï¿½mente": "cuidadosámente",
          "abundï¿½nte": "abundánte",
          "ayudï¿½nte": "ayudánte",
          "tranquilamï¿½nte": "tranquilaménte",
          "tranquilï¿½mente": "tranquilámente",
          "importï¿½nte": "importánte",
          "iguï¿½lmente": "iguálmente",
          "desodorï¿½nte": "desodoránte",
          "calmï¿½nte": "calmánte",
          "desafiï¿½nte": "desafiánte",
          "sutï¿½lmente": "sutílmente",
          "sï¿½tilmente": "sútilmente",
          "cariï¿½osamente": "cariñosamente",
          "cariï¿½ozamente": "cariñozamente",
          "cariï¿½ï¿½samente": "cariñósamente",
          "justamï¿½nte": "justaménte",
          "jï¿½stamente": "jústamente",
          "atentamï¿½nte": "atentaménte",
          "atï¿½ntamente": "aténtamente",
          "cï¿½ntradictorio": "cóntradictorio",
          "biolï¿½n": "biolín",
          "edificï¿½r": "edificár",
          "edï¿½ficar": "edíficar",
          "portafï¿½lios": "portafólios",
          "pï¿½rtafolios": "pórtafolios",
          "terrï¿½stre": "terréstre",
          "terrestrï¿½": "terrestré",
          "dictadï¿½r": "dictadór",
          "exportï¿½r": "exportár",
          "gratificï¿½r": "gratificár",
          "aterrizï¿½r": "aterrizár",
          "atï¿½rrizar": "atérrizar",
          "veredï¿½cto": "veredícto",
          "personificï¿½r": "personificár",
          "pasapï¿½rte": "pasapórte",
          "terrï¿½za": "terráza",
          "dictï¿½r": "dictár",
          "dictï¿½men": "dictámen",
          "terrï¿½no": "terréno",
          "plastificï¿½r": "plastificár",
          "comportamiï¿½nto": "comportamiénto",
          "trï¿½nsporte": "tránsporte",
          "territï¿½rio": "território",
          "continï¿½a": "continúa",
          "kontinï¿½a": "kontinúa",
          "comtinï¿½a": "comtinúa",
          "continï¿½a": "continóa",
          "gradï¿½an": "gradúan",
          "gredï¿½an": "gredúan",
          "graduï¿½r": "graduár",
          "sï¿½ria": "séria",
          "serï¿½a": "sería",
          "serï¿½a": "seréa",
          "cerï¿½a": "cería",
          "serrï¿½a": "serría",
          "zï¿½bia": "zábia",
          "sabï¿½a": "sabía",
          "zabï¿½a": "zabía",
          "zabï¿½a": "zabéa",
          "sabï¿½a": "sabéa",
          "paï¿½s": "país",
          "paï¿½z": "paíz",
          "pï¿½is": "páis",
          "paisï¿½je": "paisáje",
          "sonrï¿½e": "sonríe",
          "sonrrï¿½e": "sonrríe",
          "sonriï¿½": "sonrió",
          "sonrriï¿½": "sonrrió",
          "somriï¿½": "somrió",
          "sonriï¿½ndome": "sonriéndome",
          "sonrriï¿½ndome": "sonrriéndome",
          "sorriï¿½ndome": "sorriéndome",
          "hiervï¿½": "hiervó",
          "austeridï¿½d": "austeridád",
          "veï¿½amos": "veíamos",
          "beï¿½amos": "beíamos",
          "veiï¿½mos": "veiámos",
          "caimï¿½n": "caimán",
          "caemï¿½n": "caemán",
          "cï¿½iman": "cáiman",
          "espï¿½cio": "espácio",
          "cuï¿½rvo": "cuérvo",
          "sirviï¿½nte": "sirviénte",
          "emociï¿½n": "emoción",
          "emosiï¿½n": "emosión",
          "ï¿½mocion": "émocion",
          "mansiï¿½n": "mansión",
          "manciï¿½n": "manción",
          "mï¿½nsion": "mánsion",
          "tensiï¿½n": "tensión",
          "tenciï¿½n": "tención",
          "tï¿½nsion": "ténsion",
          "corrï¿½r": "corrér",
          "alfilï¿½r": "alfilér",
          "ï¿½lfiler": "álfiler",
          "jabalï¿½": "jabalí",
          "gabalï¿½": "gabalí",
          "jï¿½bali": "jábali",
          "sartï¿½n": "sartén",
          "zartï¿½n": "zartén",
          "sï¿½rten": "sárten",
          "audï¿½z": "audáz",
          "ï¿½udaz": "áudaz",
          "ademï¿½s": "además",
          "hademï¿½s": "hademás",
          "ï¿½demas": "ádemas",
          "jamï¿½s": "jamás",
          "gamï¿½s": "gamás",
          "jï¿½mas": "jámas",
          "sofï¿½": "sofá",
          "zofï¿½": "zofá",
          "sï¿½fa": "sófa",
          "hotï¿½l": "hotél",
          "corazï¿½n": "corazón",
          "corasï¿½n": "corasón",
          "cï¿½razon": "córazon",
          "medï¿½r": "medír",
          "allï¿½": "allí",
          "hallï¿½": "hallí",
          "ayï¿½": "ayí",
          "perejï¿½l": "perejíl",
          "pï¿½rejil": "pérejil",
          "millï¿½n": "millón",
          "miyï¿½n": "miyón",
          "mï¿½llon": "míllon",
          "cafï¿½": "café",
          "kafï¿½": "kafé",
          "cï¿½fe": "cáfe",
          "altitï¿½d": "altitúd",
          "ï¿½ltitud": "áltitud",
          "lï¿½piz": "lápiz",
          "lï¿½pis": "lápis",
          "lapï¿½z": "lapíz",
          "fï¿½rtil": "fértil",
          "fï¿½rtel": "fértel",
          "fertï¿½l": "fertíl",
          "ï¿½gil": "ágil",
          "hï¿½gil": "hágil",
          "ï¿½jil": "ájil",
          "agï¿½l": "agíl",
          "ï¿½ngel": "ángel",
          "ï¿½njel": "ánjel",
          "angï¿½l": "angél",
          "ï¿½til": "útil",
          "hï¿½til": "hútil",
          "utï¿½l": "utíl",
          "mï¿½vil": "móvil",
          "mï¿½bil": "móbil",
          "movï¿½l": "movíl",
          "ï¿½rbol": "árbol",
          "hï¿½rbol": "hárbol",
          "arbï¿½l": "arból",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "ï¿½zucar": "ázucar",
          "crï¿½ter": "cráter",
          "cratï¿½r": "cratér",
          "cï¿½sped": "césped",
          "sï¿½sped": "sésped",
          "cespï¿½d": "cespéd",
          "cuï¿½rno": "cuérno",
          "cuernï¿½": "cuernó",
          "encï¿½ma": "encíma",
          "sï¿½na": "sána",
          "cariï¿½osas": "cariñosas",
          "cariï¿½ozas": "cariñozas",
          "cï¿½riï¿½osas": "cáriñosas",
          "valiï¿½nte": "valiénte",
          "palï¿½bra": "palábra",
          "pï¿½labra": "pálabra",
          "cï¿½rcel": "cárcel",
          "cï¿½rsel": "cársel",
          "carcï¿½l": "carcél",
          "hï¿½mbro": "hómbro",
          "estï¿½ndar": "estándar",
          "hestï¿½ndar": "hestándar",
          "estandï¿½r": "estandár",
          "ustï¿½des": "ustédes",
          "ï¿½stedes": "ústedes",
          "ï¿½ltimo": "último",
          "hï¿½ltimo": "húltimo",
          "ultï¿½mo": "ultímo",
          "fï¿½rmula": "fórmula",
          "formï¿½la": "formúla",
          "formulï¿½": "formulá",
          "lï¿½gica": "lógica",
          "lï¿½jica": "lójica",
          "logicï¿½": "logicá",
          "mï¿½gica": "mágica",
          "mï¿½jica": "májica",
          "magï¿½ca": "magíca",
          "parï¿½sito": "parásito",
          "parï¿½cito": "parácito",
          "pï¿½rasito": "párasito",
          "mecï¿½nico": "mecánico",
          "mecï¿½neco": "mecáneco",
          "mï¿½canico": "mécanico",
          "brï¿½jula": "brújula",
          "brï¿½gula": "brúgula",
          "brujï¿½la": "brujúla",
          "vï¿½ndeselo": "véndeselo",
          "vendesï¿½lo": "vendesélo",
          "cï¿½mpraselo": "cómpraselo",
          "comprasï¿½lo": "comprasélo",
          "esdrï¿½jula": "esdrújula",
          "esdrï¿½gula": "esdrúgula",
          "esdrujï¿½la": "esdrujúla",
          "vï¿½monos": "vámonos",
          "vï¿½mosnos": "vámosnos",
          "vamonï¿½s": "vamonós",
          "pï¿½talo": "pétalo",
          "petalï¿½": "petaló",
          "petï¿½lo": "petálo",
          "prï¿½stamelo": "préstamelo",
          "prestamï¿½lo": "prestamélo",
          "prestamelï¿½": "prestameló",
          "tï¿½matelo": "tómatelo",
          "tomatï¿½lo": "tomatélo",
          "tomatelï¿½": "tomateló",
          "cï¿½metelo": "cómetelo",
          "cometï¿½lo": "cometélo",
          "cometelï¿½": "cometeló",
          "lï¿½mina": "lámina",
          "lamï¿½na": "lamína",
          "laminï¿½": "laminá",
          "ï¿½ndice": "índice",
          "ï¿½ndise": "índise",
          "indicï¿½": "indicé",
          "ï¿½nimo": "ánimo",
          "anï¿½mo": "anímo",
          "animï¿½": "animó",
          "ï¿½dolo": "ídolo",
          "idï¿½lo": "idólo",
          "idolï¿½": "idoló",
          "dï¿½melo": "dímelo",
          "dimï¿½lo": "dimélo",
          "dimelï¿½": "dimeló",
          "cobrï¿½zo": "cobrízo",
          "enfï¿½rmiza": "enférmiza",
          "plomï¿½zo": "plomízo",
          "cobï¿½rtizo": "cobértizo",
          "fronterï¿½zo": "fronterízo",
          "primerï¿½za": "primeríza",
          "caballï¿½riza": "caballériza",
          "advenï¿½dizo": "advenédizo",
          "sï¿½": "sí",
          "ssï¿½": "ssí",
          "sï¿½i": "síi",
          "zï¿½": "zí",
          "sï¿½": "sé",
          "sï¿½e": "sée",
          "ssï¿½": "ssé",
          "dï¿½": "dé",
          "ddï¿½": "ddé",
          "dï¿½e": "dée",
          "mï¿½s": "más",
          "mmï¿½s": "mmás",
          "mï¿½as": "máas",
          "mï¿½z": "máz",
          "tï¿½": "té",
          "ttï¿½": "tté",
          "tï¿½e": "tée",
          "ï¿½l": "él",
          "hï¿½l": "hél",
          "hï¿½l": "hél",
          "tï¿½": "tú",
          "tï¿½u": "túu",
          "ttï¿½": "ttú",
          "mï¿½": "mí",
          "mï¿½i": "míi",
          "mmï¿½": "mmí",
          "cï¿½mo": "cómo",
          "cï¿½mmo": "cómmo",
          "cï¿½omo": "cóomo",
          "quï¿½": "qué",
          "quuï¿½": "quué",
          "quï¿½e": "quée",
          "qï¿½": "qé",
          "pasï¿½bamos": "pasábamos",
          "pasï¿½vamos": "pasávamos",
          "pasï¿½abamos": "paséabamos",
          "apretï¿½": "apreté",
          "aprietï¿½": "aprieté",
          "salï¿½": "salí",
          "zalï¿½": "zalí",
          "salï¿½": "salé",
          "partï¿½": "partí",
          "pï¿½rti": "párti",
          "partï¿½": "parté",
          "dejï¿½": "dejé",
          "degï¿½": "degé",
          "dejï¿½": "dejí",
          "comï¿½amos": "comíamos",
          "comiï¿½mos": "comiámos",
          "comï¿½amos": "coméamos",
          "tomï¿½": "tomé",
          "tï¿½me": "tóme",
          "tomï¿½": "tomí",
          "podrï¿½a": "podría",
          "podrï¿½a": "podréa",
          "pondriï¿½": "pondriá",
          "iniciarï¿½a": "iniciaría",
          "inisiarï¿½a": "inisiaría",
          "iniciariï¿½": "iniciariá",
          "sabrï¿½a": "sabría",
          "zabrï¿½a": "zabría",
          "sï¿½bria": "sábria",
          "habrï¿½a": "habría",
          "hï¿½bria": "hábria",
          "saldrï¿½a": "saldría",
          "zaldrï¿½a": "zaldría",
          "saldriï¿½": "saldriá",
          "comerï¿½a": "comería",
          "comï¿½ria": "coméria",
          "comeriï¿½": "comeriá",
          "irï¿½": "iré",
          "tendrï¿½": "tendré",
          "temdrï¿½": "temdré",
          "tï¿½ndre": "téndre",
          "correrï¿½": "correrá",
          "corrï¿½ra": "corréra",
          "cï¿½rrera": "córrera",
          "imaginarï¿½": "imaginaré",
          "imajinarï¿½": "imajinaré",
          "imï¿½ginare": "imáginare",
          "pagarï¿½": "pagaré",
          "pagï¿½re": "pagáre",
          "pï¿½gare": "págare",
          "viajï¿½bamos": "viajábamos",
          "viagï¿½bamos": "viagábamos",
          "viï¿½jabamos": "viájabamos",
          "esconderï¿½": "esconderé",
          "escondï¿½re": "escondére",
          "ï¿½scondere": "éscondere",
          "apetitï¿½sa": "apetitósa",
          "furiï¿½so": "furióso",
          "ï¿½lgebra": "álgebra",
          "ï¿½ljebra": "áljebra",
          "algï¿½bra": "algébra",
          "divï¿½n": "diván",
          "dibï¿½n": "dibán",
          "dï¿½van": "dívan",
          "ï¿½lixir": "élixir",
          "hazaï¿½a": "hazaña",
          "hasaï¿½a": "hasaña",
          "hï¿½zaï¿½a": "házaña",
          "jinï¿½te": "jinéte",
          "jï¿½nete": "jínete",
          "almacï¿½n": "almacén",
          "almasï¿½n": "almasén",
          "almazï¿½n": "almazén",
          "almï¿½cen": "almácen",
          "albï¿½rca": "albérca",
          "nï¿½car": "nácar",
          "nacï¿½r": "nacár",
          "ojalï¿½": "ojalá",
          "hojalï¿½": "hojalá",
          "ï¿½jala": "ójala",
          "gï¿½itarra": "güitarra",
          "guï¿½tarra": "guítarra",
          "tarï¿½ma": "taríma",
          "tï¿½rima": "tárima",
          "bï¿½renjena": "bérenjena",
          "zanï¿½horia": "zanáhoria",
          "barriï¿½": "barrió",
          "gabï¿½n": "gabán",
          "gï¿½ban": "gában",
          "jazmï¿½n": "jazmín",
          "jasmï¿½n": "jasmín",
          "jï¿½zmin": "jázmin",
          "baï¿½o": "baño",
          "baï¿½io": "bañio",
          "zafrï¿½": "zafrá",
          "zï¿½fra": "záfra",
          "combinaciï¿½n": "combinación",
          "conbinaciï¿½n": "conbinación",
          "combinasiï¿½n": "combinasión",
          "combinacï¿½on": "combinacíon",
          "proviï¿½ne": "proviéne",
          "combï¿½tir": "combátir",
          "congestiï¿½n": "congestión",
          "conjestiï¿½n": "conjestión",
          "comgestiï¿½n": "comgestión",
          "congestï¿½on": "congestíon",
          "confraternï¿½r": "confraternár",
          "prosï¿½guir": "proséguir",
          "confirmaciï¿½n": "confirmación",
          "confirmasiï¿½n": "confirmasión",
          "comfirmaciï¿½n": "comfirmación",
          "confirmacï¿½on": "confirmacíon",
          "componï¿½r": "componér",
          "cï¿½mponer": "cómponer",
          "comparï¿½r": "comparár",
          "cï¿½mparar": "cómparar",
          "epï¿½dermis": "epídermis",
          "compartï¿½r": "compartír",
          "compï¿½rtir": "compártir",
          "promï¿½ver": "promóver",
          "epï¿½centro": "epícentro",
          "compï¿½dre": "compádre",
          "compadrï¿½": "compadré",
          "consegï¿½ir": "consegüir",
          "consï¿½guir": "conséguir",
          "proclamï¿½r": "proclamár",
          "proclï¿½mar": "proclámar",
          "sï¿½perabundancia": "súperabundancia",
          "semicï¿½rculo": "semicírculo",
          "semisï¿½rculo": "semisírculo",
          "semicircï¿½lo": "semicircúlo",
          "superdotï¿½do": "superdotádo",
          "sï¿½perdotado": "súperdotado",
          "antiï¿½cido": "antiácido",
          "antiï¿½sido": "antiásido",
          "antiacï¿½do": "antiacído",
          "sï¿½perponer": "súperponer",
          "supervisiï¿½n": "supervisión",
          "superviciï¿½n": "supervición",
          "supervisï¿½on": "supervisíon",
          "antibiï¿½tico": "antibiótico",
          "antebiï¿½tico": "antebiótico",
          "antibiotï¿½co": "antibiotíco",
          "sï¿½perpoblado": "súperpoblado",
          "anticonstï¿½tucional": "anticonstítucional",
          "sobreactuï¿½r": "sobreactuár",
          "sobrecargï¿½": "sobrecargá",
          "semiolvidï¿½do": "semiolvidádo",
          "sobrehumanï¿½": "sobrehumanó",
          "semiacï¿½bado": "semiacábado",
          "sobrenï¿½mbre": "sobrenómbre",
          "sobrenombrï¿½": "sobrenombré",
          "semidï¿½sierto": "semidésierto",
          "sï¿½bremesa": "sóbremesa",
          "anticuï¿½rpo": "anticuérpo",
          "subterrï¿½neo": "subterráneo",
          "subterranï¿½o": "subterranéo",
          "subï¿½ltero": "subáltero",
          "subdï¿½rector": "subdírector",
          "subrï¿½yar": "subráyar",
          "subgrupï¿½": "subgrupó",
          "translï¿½cido": "translúcido",
          "traslï¿½cido": "traslúcido",
          "translï¿½sido": "translúsido",
          "trï¿½nslucido": "tránslucido",
          "subtï¿½tulo": "subtítulo",
          "sutï¿½tulo": "sutítulo",
          "subtitï¿½lo": "subtitúlo",
          "subdividï¿½r": "subdividír",
          "subestimï¿½r": "subestimár",
          "subï¿½stimar": "subéstimar",
          "fotï¿½grafo": "fotógrafo",
          "fotï¿½grefo": "fotógrefo",
          "fï¿½tografo": "fótografo",
          "microbï¿½s": "microbús",
          "microbï¿½z": "microbúz",
          "mï¿½crobus": "mícrobus",
          "telï¿½scopio": "teléscopio",
          "televisiï¿½n": "televisión",
          "televiziï¿½n": "televizión",
          "televiciï¿½n": "televición",
          "telï¿½vision": "telévision",
          "micrï¿½ondas": "micróondas",
          "autï¿½grafo": "autógrafo",
          "ahutï¿½grafo": "ahutógrafo",
          "ï¿½utografo": "áutografo",
          "telï¿½grama": "telégrama",
          "micrï¿½segundo": "micrósegundo",
          "cinematï¿½grafo": "cinematógrafo",
          "sinematï¿½grafo": "sinematógrafo",
          "cinemï¿½tografo": "cinemátografo",
          "microcirugï¿½a": "microcirugía",
          "microsirugï¿½a": "microsirugía",
          "microcirujï¿½a": "microcirujía",
          "micrï¿½cirugia": "micrócirugia",
          "micrï¿½scopio": "micróscopio",
          "telï¿½spectador": "teléspectador",
          "grafologï¿½a": "grafología",
          "grafolojï¿½a": "grafolojía",
          "grafelogï¿½a": "grafelogía",
          "grafï¿½logia": "grafólogia",
          "bibliï¿½grafo": "bibliógrafo",
          "bivliï¿½grafo": "bivliógrafo",
          "bisbliï¿½grafo": "bisbliógrafo",
          "bibliï¿½grafo": "bibliógrafo",
          "microcï¿½nta": "microcínta",
          "telï¿½grafo": "telégrafo",
          "telï¿½grafo": "telógrafo",
          "tï¿½legrafo": "télegrafo",
          "microclï¿½ma": "microclíma",
          "radiotelefonï¿½a": "radiotelefonía",
          "radiotelofononï¿½a": "radiotelofononía",
          "radiotï¿½lefonia": "radiotélefonia",
          "audiciï¿½n": "audición",
          "audisiï¿½n": "audisión",
          "audiziï¿½n": "audizión",
          "ï¿½udision": "áudision",
          "auditï¿½rio": "auditório",
          "ï¿½udio": "áudio",
          "audiï¿½": "audió",
          "inï¿½udible": "ináudible",
          "audiometrï¿½a": "audiometría",
          "ahudiometrï¿½a": "ahudiometría",
          "audiomï¿½tria": "audiométria",
          "abrï¿½pto": "abrúpto",
          "ruptï¿½ra": "ruptúra",
          "interruptï¿½r": "interruptór",
          "exï¿½brupto": "exábrupto",
          "descrï¿½bir": "descríbir",
          "inscribï¿½r": "inscribír",
          "manuscrï¿½be": "manuscríbe",
          "aspï¿½cto": "aspécto",
          "respï¿½cto": "respécto",
          "espectï¿½culo": "espectáculo",
          "expectï¿½culo": "expectáculo",
          "ecspectï¿½culo": "ecspectáculo",
          "ï¿½spectaculo": "éspectaculo",
          "inspecciï¿½n": "inspección",
          "inspexiï¿½n": "inspexión",
          "inspecsiï¿½n": "inspecsión",
          "inspeccï¿½on": "inspeccíon",
          "ï¿½nspector": "ínspector",
          "erupciï¿½n": "erupción",
          "erucciï¿½n": "erucción",
          "erucsiï¿½n": "erucsión",
          "ojeï¿½r": "ojeár",
          "ojï¿½ar": "ojéar",
          "hogeï¿½r": "hogeár",
          "hojï¿½ar": "hojéar",
          "tambiï¿½n": "también",
          "tanbiï¿½n": "tanbién",
          "tï¿½mbien": "támbien",
          "tan biï¿½n": "tan bién",
          "hï¿½ber": "háber",
          "ha vï¿½r": "ha vér",
          "avï¿½r": "avér",
          "asimï¿½smo": "asimísmo",
          "asï¿½mismo": "asímismo",
          "ï¿½simismo": "ásimismo",
          "a sï¿½ mismo": "a sí mismo",
          "ï¿½ si mismo": "á si mismo",
          "sï¿½no": "síno",
          "sinï¿½": "sinó",
          "sï¿½ no": "sí no",
          "si nï¿½": "si nó",
          "tampï¿½co": "tampóco",
          "tï¿½mpoco": "támpoco",
          "tam pï¿½co": "tam póco",
          "tï¿½n poco": "tán poco",
          "hï¿½cho": "hécho",
          "hï¿½hco": "héhco",
          "ï¿½cho": "écho",
          "porqï¿½": "porqé",
          "porqiï¿½": "porqié",
          "por quï¿½": "por qué",
          "pï¿½r quï¿½": "pór qué",
          "pï¿½r que": "pór que",
          "reusï¿½r": "reusár",
          "reuhsï¿½r": "reuhsár",
          "rehï¿½sar": "rehúsar",
          "reï¿½sar": "reúsar",
          "reusï¿½r": "reusár",
          "rï¿½usar": "réusar",
          "en tï¿½rno": "en tórno",
          "ï¿½n torno": "én torno",
          "entï¿½rno": "entórno",
          "ï¿½ntorno": "éntorno",
          "composiciï¿½n": "composición",
          "compociciï¿½n": "compocición",
          "composisiï¿½n": "composisión",
          "composicï¿½on": "composicíon",
          "escenï¿½rio": "escenário",
          "excï¿½ntrico": "excéntrico",
          "exï¿½ntrico": "exéntrico",
          "eccï¿½ntrico": "eccéntrico",
          "fï¿½scinar": "fáscinar",
          "agï¿½jero": "agújero",
          "bohï¿½mio": "bohémio",
          "calï¿½bozo": "calábozo",
          "exchï¿½bir": "exchíbir",
          "pï¿½scuezo": "péscuezo",
          "enhï¿½brar": "enhébrar",
          "grisï¿½ceo": "grisáceo",
          "grisï¿½seo": "grisáseo",
          "grizï¿½ceo": "grizáceo",
          "hï¿½bitat": "hábitat",
          "hï¿½bitad": "hábitad",
          "habitï¿½t": "habitát",
          "hï¿½billa": "hébilla",
          "higiï¿½nico": "higiénico",
          "higï¿½nico": "higénico",
          "hijiï¿½nico": "hijiénico",
          "hipï¿½tesis": "hipótesis",
          "hipï¿½tecis": "hipótecis",
          "ipï¿½tesis": "ipótesis",
          "lombrï¿½z": "lombríz",
          "relojï¿½ro": "relojéro",
          "extermï¿½nador": "extermínador",
          "pï¿½sajero": "pásajero",
          "mï¿½sero": "mésero",
          "carpintï¿½ra": "carpintéra",
          "hormigï¿½ero": "hormigüero",
          "hï¿½rmiguero": "hórmiguero",
          "nï¿½dador": "nádador",
          "remï¿½lcador": "remólcador",
          "despertadï¿½r": "despertadór",
          "despï¿½rtador": "despértador",
          "operadï¿½ra": "operadóra",
          "opï¿½radora": "opéradora",
          "limonï¿½ro": "limonéro",
          "limï¿½nero": "limónero",
          "cochï¿½ra": "cochéra",
          "reparadï¿½ra": "reparadóra",
          "contadï¿½r": "contadór",
          "diseï¿½adora": "diseñadora",
          "deseï¿½adora": "deseñadora",
          "diseï¿½ï¿½dor": "diseñádor",
          "licuadï¿½ra": "licuadóra",
          "licuï¿½dora": "licuádora",
          "calculadï¿½ra": "calculadóra",
          "cï¿½lculadora": "cálculadora",
          "costurï¿½ra": "costuréra",
          "cï¿½sturera": "cósturera",
          "iingenï¿½era": "iingeníera",
          "ï¿½samblea": "ásamblea",
          "bï¿½nquete": "bánquete",
          "cï¿½bina": "cábina",
          "detï¿½lle": "detálle",
          "dï¿½talle": "détalle",
          "chofï¿½r": "chofér",
          "chï¿½fer": "chófer",
          "bebï¿½": "bebé",
          "bevï¿½": "bevé",
          "biebï¿½": "biebé",
          "departamï¿½nto": "departaménto",
          "chï¿½f": "chéf",
          "etï¿½pa": "etápa",
          "flï¿½cha": "flécha",
          "flechï¿½": "flechá",
          "carnï¿½": "carné",
          "carnï¿½d": "carnéd",
          "karnï¿½": "karné",
          "jardï¿½n": "jardín",
          "gardï¿½n": "gardín",
          "jï¿½rdin": "járdin",
          "chaquï¿½ta": "chaquéta",
          "chï¿½queta": "cháqueta",
          "merengï¿½e": "merengüe",
          "mï¿½rengue": "mérengue",
          "nortï¿½": "norté",
          "pantalï¿½n": "pantalón",
          "pantï¿½lon": "pantálon",
          "pï¿½ntalon": "pántalon",
          "aviï¿½n": "avión",
          "haviï¿½n": "havión",
          "ï¿½vion": "ávion",
          "bï¿½jito": "bájito",
          "viï¿½jita": "viéjita",
          "pokitï¿½co": "pokitíco",
          "pï¿½quitico": "póquitico",
          "ratï¿½to": "ratíto",
          "pequeï¿½ita": "pequeñita",
          "pekeï¿½ita": "pekeñita",
          "pequeï¿½itia": "pequeñitia",
          "gatï¿½ta": "gatíta",
          "pisotï¿½n": "pisotón",
          "pizotï¿½n": "pizotón",
          "pisï¿½ton": "pisóton",
          "taconï¿½zo": "taconázo",
          "zapatï¿½nes": "zapatónes",
          "zapatonï¿½s": "zapatonés",
          "respondï¿½n": "respondón",
          "rezpondï¿½n": "rezpondón",
          "respï¿½ndon": "respóndon",
          "grandï¿½te": "grandóte",
          "pelotï¿½zo": "pelotázo",
          "botellï¿½n": "botellón",
          "boteyï¿½n": "boteyón",
          "bï¿½tellon": "bótellon",
          "golï¿½zo": "golázo",
          "golazï¿½": "golazó",
          "golpetï¿½zo": "golpetázo",
          "gï¿½lpetazo": "gólpetazo",
          "grandulï¿½n": "grandulón",
          "grandï¿½lon": "grandúlon",
        };
        return (
          (a = a in o ? o[a] : a),
          (a = a.toLowerCase()),
          (a = a.replace("'", "")),
          (a = a.replace(".", "")),
          (a = a.replace(".", "")),
          (a = a.replace("'", "")),
          (a = a.replace(/ñ/g, "n")),
          (a = a.replace(/á/g, "a")),
          (a = a.replace(/ú/g, "u")),
          (a = a.replace(/í/g, "i")),
          (a = a.replace(/é/g, "e")),
          (a = a.replace(/ó/g, "o")),
          (a = a.replace(/ü/g, "u")),
          (a = a.replace(/ /g, "_")),
          "Homophones" ==
            e.levelGroups[e.currentLevelGroup][e.currentLevel].rule &&
            (a += "_example"),
          "assets/videos/word/" + (a += ".mp4")
        );
      }
      function m(a) {
        var o = {
          "Palabras de ortografï¿½a": "Palabras de ortografía",
          "Mayï¿½s": "Mayús",
          capNÑ: "Ñ",
          "capNï¿½": "Ñ",
          capAÁ: "Á",
          "capAï¿½": "Á",
          capEÉ: "É",
          "capEï¿½": "É",
          capIÍ: "Í",
          "capIï¿½": "Í",
          capOÓ: "Ó",
          "capOï¿½": "Ó",
          capUÚ: "Ú",
          "capUï¿½": "Ú",
          capUUÜ: "Ü",
          "capUUï¿½": "Ü",
          smallnñ: "ñ",
          "smallnï¿½": "ñ",
          smallaá: "á",
          "smallaï¿½": "á",
          smalleé: "é",
          "smalleï¿½": "é",
          smallií: "í",
          "smalliï¿½": "í",
          smalloó: "ó",
          "smalloï¿½": "ó",
          smalluú: "ú",
          "smalluï¿½": "ú",
          smalluuü: "ü",
          "smalluuï¿½": "ü",
          "cafï¿½": "café",
          "trampolï¿½n": "trampolín",
          "trampollï¿½n": "trampollín",
          "floristerï¿½a": "floristería",
          "florï¿½steria": "florísteria",
          "ajï¿½": "ají",
          "agï¿½": "agí",
          "agitaciï¿½n": "agitación",
          "ajitaciï¿½n": "ajitación",
          "construï¿½": "construí",
          "construyï¿½": "construyí",
          "costruï¿½": "costruí",
          "mediodï¿½a": "mediodía",
          "mediadï¿½a": "mediadía",
          "telaraï¿½a": "telaraña",
          "telaaraï¿½a": "telaaraña",
          "teleraï¿½a": "teleraña",
          "dï¿½a": "día",
          "grï¿½a": "grúa",
          "gurï¿½a": "gurúa",
          "proteï¿½na": "proteína",
          "protoï¿½na": "protoína",
          "reï¿½": "reí",
          "rehï¿½": "rehí",
          "maï¿½z": "maíz",
          "maï¿½s": "maís",
          "paï¿½s": "país",
          "paï¿½z": "paíz",
          "envï¿½o": "envío",
          "henvï¿½o": "henvío",
          "gentï¿½o": "gentío",
          "jentï¿½o": "jentío",
          "baï¿½l": "baúl",
          "bahï¿½l": "bahúl",
          "desilusiï¿½n": "desilusión",
          "desiluciï¿½n": "desilución",
          "asï¿½": "así",
          "acï¿½": "ací",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "cï¿½men": "cómen",
          "comï¿½n": "comén",
          "ganï¿½": "ganó",
          "gï¿½no": "gáno",
          "apï¿½nas": "apénas",
          "ï¿½penas": "ápenas",
          "canciï¿½n": "canción",
          "cï¿½ncion": "cáncion",
          "tesï¿½ro": "tesóro",
          "tesorï¿½": "tesoró",
          "detrï¿½s": "detrás",
          "dï¿½tras": "détras",
          "valï¿½r": "valór",
          "vï¿½lor": "válor",
          "fï¿½cil": "fácil",
          "facï¿½l": "facíl",
          "ï¿½guila": "águila",
          "aguï¿½la": "aguíla",
          "brï¿½jula": "brújula",
          "brujulï¿½": "brujulá",
          "cientï¿½fico": "científico",
          "ciï¿½ntifico": "ciéntifico",
          "dï¿½cada": "década",
          "decï¿½da": "decáda",
          "quï¿½taselo": "quítaselo",
          "quitasï¿½lo": "quitasélo",
          "levï¿½ntate": "levántate",
          "levantï¿½te": "levantáte",
          "murciï¿½lago": "murciélago",
          "murcielï¿½go": "murcielágo",
          "sï¿½bado": "sábado",
          "sabï¿½do": "sabádo",
          "entrï¿½gamelo": "entrégamelo",
          "entregï¿½melo": "entregámelo",
          "ï¿½nico": "único",
          "unï¿½co": "uníco",
          "bï¿½ho": "búho",
          "bï¿½o": "búo",
          "vehï¿½culo": "vehículo",
          "veï¿½culo": "veículo",
          "bahï¿½a": "bahía",
          "baï¿½a": "baía",
          "ahijï¿½do": "ahijádo",
          "helï¿½do": "heládo",
          "hoguï¿½ra": "hoguéra",
          "ahorrï¿½r": "ahorrár",
          "ahumï¿½r": "ahumár",
          "ï¿½tiles": "útiles",
          "jï¿½ntos": "júntos",
          "lï¿½pices": "lápices",
          "lï¿½picez": "lápicez",
          "lï¿½pizez": "lápizez",
          "camiï¿½n": "camión",
          "cï¿½mion": "cámion",
          "marï¿½timo": "marítimo",
          "marï¿½stimo": "marístimo",
          "demï¿½s": "demás",
          "demï¿½z": "demáz",
          "aï¿½reo": "aéreo",
          "ï¿½ereo": "áereo",
          "ganï¿½do": "ganádo",
          "pingï¿½ino": "pingüino",
          "pengï¿½ino": "pengüino",
          "desagï¿½e": "desagüe",
          "bilingï¿½e": "bilingüe",
          "algï¿½nos": "algünos",
          "niï¿½ez": "niñez",
          "niï¿½es": "niñes",
          "bondï¿½": "bondá",
          "mirarï¿½": "miraré",
          "merarï¿½": "meraré",
          "jugï¿½": "jugó",
          "jï¿½go": "júgo",
          "cambiï¿½": "cambió",
          "cï¿½mbio": "cámbio",
          "escribï¿½": "escribé",
          "saltï¿½": "saltó",
          "sï¿½lto": "sálto",
          "cambiï¿½": "cambió",
          "cï¿½mbio": "cámbio",
          "volverï¿½": "volveré",
          "volvï¿½re": "volvére",
          "serï¿½": "seré",
          "sï¿½re": "sére",
          "saltï¿½": "salté",
          "sï¿½lte": "sálte",
          "votarï¿½": "votaré",
          "votï¿½re": "votáre",
          "ï¿½l": "él",
          "hï¿½l": "hél",
          "ï¿½l": "él",
          "sï¿½": "sí",
          "cï¿½": "cí",
          "mï¿½": "mí",
          "quï¿½": "qué",
          "qï¿½": "qé",
          "quï¿½": "qué",
          "cï¿½mo": "cómo",
          "kï¿½mo": "kómo",
          "sï¿½is": "séis",
          "difï¿½cil": "difícil",
          "difï¿½sil": "difísil",
          "avanzï¿½": "avanzó",
          "avansï¿½": "avansó",
          "narï¿½z": "naríz",
          "sï¿½mbolo": "símbolo",
          "sï¿½nbolo": "sínbolo",
          "sï¿½mvolo": "símvolo",
          "compï¿½s": "compás",
          "conpï¿½s": "conpás",
          "compï¿½z": "compáz",
          "sonreï¿½do": "sonreído",
          "somreï¿½do": "somreído",
          "traï¿½do": "traído",
          "trahï¿½do": "trahído",
          "aï¿½reo": "aéreo",
          "aï¿½rio": "aério",
          "hï¿½roe": "héroe",
          "hï¿½rue": "hérue",
          "camaleï¿½n": "camaleón",
          "kamaleï¿½n": "kamaleón",
          "aereolï¿½nea": "aereolínea",
          "aereolï¿½nea": "aereolínea",
          "poesï¿½a": "poesía",
          "puesï¿½a": "puesía",
          "geï¿½grafo": "geógrafo",
          "jeï¿½grafo": "jeógrafo",
          "canï¿½a": "canúa",
          "pasï¿½a": "pasía",
          "biografï¿½a": "biografía",
          "viografï¿½a": "viografía",
          "actï¿½a": "actúa",
          "hactï¿½a": "hactúa",
          "sonreï¿½rse": "sonreírse",
          "sonrreï¿½rse": "sonrreírse",
          "maï¿½z": "maíz",
          "maï¿½s": "maís",
          "sabï¿½a": "sabía",
          "savï¿½a": "savía",
          "habï¿½a": "había",
          "havï¿½a": "havía",
          "rï¿½o": "río",
          "rrï¿½o": "rrío",
          "recaï¿½da": "recaída",
          "rrecaï¿½da": "rrecaída",
          "distraï¿½do": "distraído",
          "destraï¿½do": "destraído",
          "gentï¿½o": "gentío",
          "jentï¿½o": "jentío",
          "baï¿½l": "baúl",
          "vaï¿½l": "vaúl",
          "proteï¿½na": "proteína",
          "protenï¿½a": "protenía",
          "aï¿½lla": "aúlla",
          "aï¿½ya": "aúya",
          "garantï¿½a": "garantía",
          "garentï¿½a": "garentía",
          "bohï¿½o": "bohío",
          "vohï¿½o": "vohío",
          "cacatï¿½a": "cacatúa",
          "kakatï¿½a": "kakatúa",
          "Raï¿½l": "Raúl",
          "Marï¿½a": "María",
          "Marrï¿½a": "Marría",
          "baterï¿½a": "batería",
          "vaterï¿½a": "vatería",
          "mï¿½o": "mío",
          "mï¿½u": "míu",
          "inacciï¿½n": "inacción",
          "inaxiï¿½n": "inaxión",
          "sobreactuï¿½r": "sobreactuár",
          "sobresalï¿½r": "sobresalír",
          "subacuï¿½tico": "subacuático",
          "suvacuï¿½tico": "suvacuático",
          "subestaciï¿½n": "subestación",
          "suvestaciï¿½n": "suvestación",
          "imï¿½genes": "imágenes",
          "imï¿½jenes": "imájenes",
          "lï¿½pices": "lápices",
          "lï¿½pizes": "lápizes",
          "lï¿½pises": "lápises",
          "telï¿½fonos": "teléfonos",
          "telï¿½fones": "teléfones",
          "lugï¿½ares": "lugüares",
          "dï¿½adema": "díadema",
          "reuniï¿½n": "reunión",
          "riuniï¿½n": "riunión",
          "bï¿½isbol": "béisbol",
          "beisbï¿½l": "beisból",
          "vï¿½isbol": "véisbol",
          "ruï¿½nas": "ruínas",
          "ruï¿½do": "ruído",
          "fuï¿½": "fuí",
          "foï¿½": "foí",
          "incluï¿½do": "incluído",
          "ruiseï¿½or": "ruiseñor",
          "ruiceï¿½or": "ruiceñor",
          "intuiciï¿½n": "intuición",
          "intuisiï¿½n": "intuisión",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biografï¿½a": "biografía",
          "beografï¿½a": "beografía",
          "fonï¿½ma": "fonéma",
          "fonï¿½tica": "fonética",
          "fonï¿½tika": "fonétika",
          "polï¿½glota": "políglota",
          "pulï¿½glota": "pulíglota",
          "fonografï¿½a": "fonografía",
          "fonogrefï¿½a": "fonogrefía",
          "grï¿½fico": "gráfico",
          "grï¿½fiko": "gráfiko",
          "monolingï¿½e": "monolingüe",
          "monografï¿½a": "monografía",
          "monegrafï¿½a": "monegrafía",
          "grafologï¿½a": "grafología",
          "grafolojï¿½a": "grafolojía",
          "policï¿½falo": "policéfalo",
          "polisï¿½falo": "poliséfalo",
          "polï¿½gono": "polígono",
          "polï¿½gomo": "polígomo",
          "policromï¿½a": "policromía",
          "polikromï¿½a": "polikromía",
          "acuï¿½rio": "acuário",
          "acuï¿½tico": "acuático",
          "hacuï¿½tico": "hacuático",
          "acuanï¿½uta": "acuanáuta",
          "acuï¿½so": "acuóso",
          "acuarï¿½la": "acuaréla",
          "acuï¿½fero": "acuífero",
          "aquï¿½fero": "aquífero",
          "dicciï¿½n": "dicción",
          "dixiï¿½n": "dixión",
          "dicsiï¿½n": "dicsión",
          "dictï¿½do": "dictádo",
          "dictï¿½r": "dictár",
          "dictï¿½men": "dictámen",
          "edï¿½cto": "edícto",
          "veredï¿½cto": "veredícto",
          "dictaminï¿½r": "dictaminár",
          "dictadï¿½r": "dictadór",
          "aï¿½reo": "aéreo",
          "haï¿½reo": "haéreo",
          "ï¿½ire": "áire",
          "cï¿½mara": "cámara",
          "kï¿½mara": "kámara",
          "camarï¿½grafo": "camarógrafo",
          "camarogrï¿½fo": "camarográfo",
          "composiciï¿½n": "composición",
          "composisiï¿½n": "composisión",
          "fï¿½cil": "fácil",
          "fï¿½sil": "fásil",
          "imï¿½gen": "imágen",
          "imï¿½genes": "imágenes",
          "imï¿½jenes": "imájenes",
          "necesitarï¿½a": "necesitaría",
          "nececitarï¿½a": "nececitaría",
          "nesesitarï¿½a": "nesesitaría",
          "produxiï¿½n": "produxión",
          "producsiï¿½n": "producsión",
          "reï¿½ne": "reúne",
          "rreï¿½ne": "rreúne",
          "reuniï¿½n": "reunión",
          "rreuniï¿½n": "rreunión",
          "Panamï¿½": "Panamá",
          "Pamamï¿½": "Pamamá",
          "guaranï¿½": "guaraná",
          "waranï¿½": "waraná",
          "chimpancï¿½": "chimpancé",
          "chimpansï¿½": "chimpansé",
          "comitï¿½": "comité",
          "cometï¿½": "cometé",
          "jamï¿½s": "jamás",
          "jammï¿½s": "jammás",
          "ajonjolï¿½": "ajonjolí",
          "agonjolï¿½": "agonjolí",
          "colibrï¿½": "colibrí",
          "colivrï¿½": "colivrí",
          "conclusiï¿½n": "conclusión",
          "concluciï¿½n": "conclución",
          "acciï¿½n": "acción",
          "axiï¿½n": "axión",
          "acsiï¿½n": "acsión",
          "algodï¿½n": "algodón",
          "halgodï¿½n": "halgodón",
          "ademï¿½s": "además",
          "hademï¿½s": "hademás",
          "dï¿½bil": "débil",
          "dï¿½vil": "dévil",
          "ï¿½rbol": "árbol",
          "ï¿½rvol": "árvol",
          "fï¿½cil": "fácil",
          "fï¿½sil": "fásil",
          "cï¿½sped": "césped",
          "hï¿½bil": "hábil",
          "hï¿½vil": "hávil",
          "difï¿½cil": "difícil",
          "difï¿½sil": "difísil",
          "lï¿½piz": "lápiz",
          "lï¿½pis": "lápis",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "pï¿½ster": "póster",
          "pï¿½sster": "pósster",
          "reacciï¿½n": "reacción",
          "reaxiï¿½n": "reaxión",
          "reacsiï¿½n": "reacsión",
          "misiï¿½n": "misión",
          "miciï¿½n": "mición",
          "canciï¿½n": "canción",
          "cansiï¿½n": "cansión",
          "ilusiï¿½n": "ilusión",
          "iluciï¿½n": "ilución",
          "confusiï¿½n": "confusión",
          "confuciï¿½n": "confución",
          "dedicaciï¿½n": "dedicación",
          "dedicasiï¿½n": "dedicasión",
          "porciï¿½n": "porción",
          "porsiï¿½n": "porsión",
          "divisiï¿½n": "división",
          "diviciï¿½n": "divición",
          "tensiï¿½n": "tensión",
          "tenciï¿½n": "tención",
          "fusiï¿½n": "fusión",
          "fuciï¿½n": "fución",
          "presiï¿½n": "presión",
          "preciï¿½n": "preción",
          "protecciï¿½n": "protección",
          "protexiï¿½n": "protexión",
          "protecsiï¿½n": "protecsión",
          "mansiï¿½n": "mansión",
          "manciï¿½n": "manción",
          "profesiï¿½n": "profesión",
          "profeciï¿½n": "profeción",
          "posiciï¿½n": "posición",
          "posisiï¿½n": "posisión",
          "pociciï¿½n": "pocición",
          "direcciï¿½n": "dirección",
          "direxiï¿½n": "direxión",
          "direcsiï¿½n": "direcsión",
          "emociï¿½n": "emoción",
          "emosiï¿½n": "emosión",
          "hemosiï¿½n": "hemosión",
          "lociï¿½n": "loción",
          "losiï¿½n": "losión",
          "diversiï¿½n": "diversión",
          "diverciï¿½n": "diverción",
          "dibersiï¿½n": "dibersión",
          "estaciï¿½n": "estación",
          "estasiï¿½n": "estasión",
          "Mï¿½xico": "México",
          "lï¿½grimas": "lágrimas",
          "lï¿½gremas": "lágremas",
          "mï¿½sica": "música",
          "mï¿½sika": "músika",
          "vï¿½rtices": "vértices",
          "vï¿½rtises": "vértises",
          "dï¿½cada": "década",
          "dï¿½kada": "dékada",
          "rï¿½pido": "rápido",
          "rrï¿½pido": "rrápido",
          "pï¿½blico": "público",
          "pï¿½bliko": "públiko",
          "esdrï¿½jula": "esdrújula",
          "sdrï¿½jula": "sdrújula",
          "ï¿½ngulo": "ángulo",
          "ï¿½ngï¿½lo": "ángülo",
          "pï¿½jaro": "pájaro",
          "pï¿½garo": "págaro",
          "nï¿½madas": "nómadas",
          "nï¿½madas": "námadas",
          "recomiï¿½ndaselo": "recomiéndaselo",
          "recomiï¿½ndacelo": "recomiéndacelo",
          "vï¿½monos": "vámonos",
          "bï¿½monos": "bámonos",
          "llï¿½vaselo": "llévaselo",
          "llï¿½vacelo": "llévacelo",
          "pï¿½samelo": "pásamelo",
          "pï¿½zamelo": "pázamelo",
          "cuï¿½ntamela": "cuéntamela",
          "kuï¿½ntamela": "kuéntamela",
          "regï¿½lasela": "regálasela",
          "rejï¿½lasela": "rejálasela",
          "devuï¿½lvemelo": "devuélvemelo",
          "debuï¿½lvemelo": "debuélvemelo",
          "aprï¿½ndetela": "apréndetela",
          "aprendetelï¿½": "aprendetelá",
          "prï¿½stamelo": "préstamelo",
          "prestamelï¿½": "prestameló",
          "almohï¿½da": "almoháda",
          "ahogï¿½do": "ahogádo",
          "bahï¿½a": "bahía",
          "baï¿½a": "baía",
          "turbohï¿½lice": "turbohélice",
          "turbohï¿½lise": "turbohélise",
          "turvohï¿½lice": "turvohélice",
          "ahï¿½nco": "ahínco",
          "aï¿½nco": "aínco",
          "alcï¿½l": "alcól",
          "alchï¿½l": "alchól",
          "zoolï¿½gico": "zoológico",
          "zolï¿½gico": "zológico",
          "soolï¿½gico": "soológico",
          "prohï¿½ben": "prohíben",
          "proï¿½ben": "proíben",
          "prohï¿½ven": "prohíven",
          "vehï¿½culo": "vehículo",
          "veï¿½culo": "veículo",
          "releyï¿½": "releyó",
          "relellï¿½": "relelló",
          "releiï¿½": "releió",
          "antisï¿½smico": "antisísmico",
          "antesï¿½smico": "antesísmico",
          "antiï¿½cido": "antiácido",
          "anteï¿½cido": "anteácido",
          "antiï¿½sido": "antiásido",
          "antiatï¿½mico": "antiatómico",
          "anteatï¿½mico": "anteatómico",
          "reagrupï¿½": "reagrupó",
          "regrupï¿½": "regrupó",
          "dormirï¿½s": "dormirás",
          "caminarï¿½": "caminaré",
          "camimarï¿½": "camimaré",
          "saldrï¿½amos": "saldríamos",
          "zaldrï¿½amos": "zaldríamos",
          "visitarï¿½s": "visitarás",
          "vicitarï¿½s": "vicitarás",
          "mirarï¿½": "miraré",
          "mirrarï¿½": "mirraré",
          "verï¿½s": "verás",
          "berï¿½s": "berás",
          "comerï¿½an": "comerían",
          "komerï¿½an": "komerían",
          "estarï¿½n": "estarán",
          "eztarï¿½n": "eztarán",
          "pasï¿½bamos": "pasábamos",
          "pasï¿½vamos": "pasávamos",
          "comï¿½": "comí",
          "komï¿½": "komí",
          "volverï¿½n": "volverán",
          "volberï¿½n": "volberán",
          "podrï¿½s": "podrás",
          "podrï¿½z": "podráz",
          "dï¿½bamos": "dábamos",
          "saltarï¿½a": "saltaría",
          "zaltarï¿½a": "zaltaría",
          "nadarï¿½a": "nadaría",
          "nadï¿½ria": "nadária",
          "trabajï¿½": "trabajó",
          "trabï¿½jo": "trabájo",
          "pasï¿½": "pasó",
          "pï¿½so": "páso",
          "ï¿½bamos": "íbamos",
          "ï¿½vamos": "ívamos",
          "cultivarï¿½a": "cultivaría",
          "cultibarï¿½a": "cultibaría",
          "fuï¿½ramos": "fuéramos",
          "fuerï¿½mos": "fuerámos",
          "fonometrï¿½a": "fonometría",
          "fonemetrï¿½a": "fonemetría",
          "fonï¿½tica": "fonética",
          "fonï¿½tica": "fonótica",
          "microbï¿½s": "microbús",
          "mecrobï¿½s": "mecrobús",
          "perï¿½metro": "perímetro",
          "pirï¿½metro": "pirímetro",
          "megï¿½fono": "megáfono",
          "meguï¿½fono": "meguáfono",
          "megalï¿½polis": "megalópolis",
          "megualï¿½polis": "megualópolis",
          "telï¿½fono": "teléfono",
          "tilï¿½fono": "tiléfono",
          "micrï¿½fono": "micrófono",
          "mecrï¿½fono": "mecrófono",
          "anglï¿½fono": "anglófono",
          "botï¿½r": "botár",
          "votï¿½r": "votár",
          "hï¿½cho": "hécho",
          "ï¿½cho": "écho",
          "cï¿½llo": "cállo",
          "cï¿½yo": "cáyo",
          "hï¿½la": "hóla",
          "ï¿½la": "óla",
          "hï¿½ndas": "hóndas",
          "ï¿½ndas": "óndas",
          "ï¿½sta": "ásta",
          "hï¿½sta": "hásta",
          "tï¿½bo": "túbo",
          "tï¿½vo": "túvo",
          "cosï¿½r": "cosér",
          "cocï¿½r": "cocér",
          "portï¿½til": "portátil",
          "portï¿½tel": "portátel",
          "portï¿½ro": "portéro",
          "aportï¿½r": "aportár",
          "portï¿½da": "portáda",
          "genealogï¿½a": "genealogía",
          "genealojï¿½a": "genealojía",
          "genialogï¿½a": "genialogía",
          "generaciï¿½n": "generación",
          "jeneraciï¿½n": "jeneración",
          "generasiï¿½n": "generasión",
          "generï¿½l": "generál",
          "generï¿½r": "generár",
          "duraciï¿½n": "duración",
          "durasiï¿½n": "durasión",
          "duraziï¿½n": "durazión",
          "durï¿½za": "duréza",
          "duradï¿½ro": "duradéro",
          "proyï¿½cto": "proyécto",
          "proyectï¿½r": "proyectór",
          "trayï¿½cto": "trayécto",
          "inyectï¿½r": "inyectár",
          "genï¿½tica": "genética",
          "jenï¿½tica": "jenética",
          "regenerï¿½r": "regenerár",
          "temprï¿½no": "tempráno",
          "contramï¿½no": "contramáno",
          "humï¿½no": "humáno",
          "lozï¿½na": "lozána",
          "andinï¿½smo": "andinísmo",
          "naturalï¿½sta": "naturalísta",
          "pianï¿½sta": "pianísta",
          "aï¿½n": "aún",
          "haï¿½n": "haún",
          "ahï¿½n": "ahún",
          "dï¿½": "dé",
          "ddï¿½": "ddé",
          "dï¿½e": "dée",
          "hï¿½l": "hél",
          "mï¿½s": "más",
          "mmï¿½s": "mmás",
          "mï¿½as": "máas",
          "mï¿½i": "míi",
          "mmï¿½": "mmí",
          "sï¿½": "sé",
          "sï¿½e": "sée",
          "ssï¿½": "ssí",
          "sï¿½i": "síi",
          "tï¿½": "té",
          "ttï¿½": "tté",
          "tï¿½e": "tée",
          "tï¿½": "tú",
          "tï¿½u": "túu",
          "ttï¿½": "ttú",
          "quï¿½": "qué",
          "quuï¿½": "quué",
          "quï¿½e": "quée",
          "excï¿½ntrico": "excéntrico",
          "exï¿½ntrico": "exéntrico",
          "exsï¿½ntrico": "exséntrico",
          "posmodï¿½rno": "posmodérno",
          "biaï¿½ual": "biañual",
          "biangï¿½lar": "biangülar",
          "triï¿½ngulo": "triángulo",
          "triï¿½ngï¿½lo": "triángülo",
          "triatlï¿½n": "triatlón",
          "trisatlï¿½n": "trisatlón",
          "transacciï¿½n": "transacción",
          "transacsiï¿½n": "transacsión",
          "transaciï¿½n": "transación",
          "televisiï¿½n": "televisión",
          "televiciï¿½n": "televición",
          "telecomunicaciï¿½n": "telecomunicación",
          "telecomunicasiï¿½n": "telecomunicasión",
          "telefonï¿½a": "telefonía",
          "telfonï¿½a": "telfonía",
          "fotografï¿½a": "fotografía",
          "fotogrefï¿½a": "fotogrefía",
          "biografï¿½a": "biografía",
          "bigrafï¿½a": "bigrafía",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "metrologï¿½a": "metrología",
          "metrolojï¿½a": "metrolojía",
          "metrilogï¿½a": "metrilogía",
          "fonï¿½grafo": "fonógrafo",
          "fonogrï¿½fo": "fonográfo",
          "telepatï¿½a": "telepatía",
          "telpatï¿½a": "telpatía",
          "telefï¿½rico": "teleférico",
          "telesfï¿½rico": "telesférico",
          "biomï¿½trico": "biométrico",
          "bimï¿½trico": "bimétrico",
          "termï¿½metro": "termómetro",
          "termomï¿½tro": "termométro",
          "cronï¿½metro": "cronómetro",
          "cronomï¿½tro": "cronométro",
          "apï¿½grafo": "apógrafo",
          "apogrï¿½fo": "apográfo",
          "psicologï¿½a": "psicología",
          "psicolojï¿½a": "psicolojía",
          "psicolï¿½gia": "psicológia",
          "favoritï¿½smo": "favoritísmo",
          "favoritï¿½smo": "favoritísmo",
          "aï¿½robismo": "aérobismo",
          "abolicionï¿½sta": "abolicionísta",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biolï¿½gia": "biológia",
          "realï¿½smo": "realísmo",
          "automovilï¿½smo": "automovilísmo",
          "realï¿½sta": "realísta",
          "reï¿½lista": "reálista",
          "tecnologï¿½a": "tecnología",
          "tecnolojï¿½a": "tecnolojía",
          "tecnolï¿½gia": "tecnológia",
          "modï¿½smo": "modísmo",
          "analï¿½sta": "analísta",
          "anï¿½lista": "análista",
          "meteorologï¿½a": "meteorología",
          "meteorolojï¿½a": "meteorolojía",
          "meteorï¿½logia": "meteorólogia",
          "cï¿½vismo": "cívismo",
          "ecologï¿½a": "ecología",
          "ecolojï¿½a": "ecolojía",
          "ecï¿½logia": "ecólogia",
          "racï¿½smo": "racísmo",
          "mitologï¿½a": "mitología",
          "mitolojï¿½a": "mitolojía",
          "mitï¿½logia": "mitólogia",
          "optimï¿½sta": "optimísta",
          "conservasionismï¿½": "conservasionismó",
          "antropologï¿½a": "antropología",
          "antropolojï¿½a": "antropolojía",
          "antrï¿½pologia": "antrópologia",
          "cronologï¿½a": "cronología",
          "cronolojï¿½a": "cronolojía",
          "crï¿½nologia": "crónologia",
          "kilï¿½metro": "kilómetro",
          "quilï¿½metro": "quilómetro",
          "kilomï¿½tro": "kilométro",
          "fotografï¿½a": "fotografía",
          "fotogrï¿½fia": "fotográfia",
          "geologï¿½a": "geología",
          "jeologï¿½a": "jeología",
          "geolojï¿½a": "geolojía",
          "geolï¿½gia": "geológia",
          "cronolï¿½gico": "cronológico",
          "cronolï¿½jico": "cronolójico",
          "cronï¿½logia": "cronólogia",
          "centï¿½metro": "centímetro",
          "sentï¿½metro": "sentímetro",
          "centimï¿½tro": "centimétro",
          "neoclï¿½sico": "neoclásico",
          "nï¿½oclasico": "néoclasico",
          "geï¿½logo": "geólogo",
          "jeï¿½logo": "jeólogo",
          "geolï¿½go": "geológo",
          "crï¿½nico": "crónico",
          "cronï¿½co": "croníco",
          "cronicï¿½": "cronicó",
          "biologï¿½a": "biología",
          "biolojï¿½a": "biolojía",
          "biolï¿½gia": "biológia",
          "neolï¿½tico": "neolítico",
          "nï¿½olitico": "néolitico",
          "neolitï¿½co": "neolitíco",
          "geografï¿½a": "geografía",
          "jeografï¿½a": "jeografía",
          "geogrï¿½fia": "geográfia",
          "fotogï¿½nica": "fotogénica",
          "fotojï¿½nica": "fotojénica",
          "fotï¿½genica": "fotógenica",
          "termï¿½metro": "termómetro",
          "tï¿½rmometro": "térmometro",
          "termomï¿½tro": "termométro",
          "fotosï¿½ntesis": "fotosíntesis",
          "fotocï¿½ntesis": "fotocíntesis",
          "fotosintï¿½sis": "fotosintésis",
          "geometrï¿½a": "geometría",
          "jeometrï¿½a": "jeometría",
          "geomï¿½tria": "geométria",
          "sincrï¿½nizar": "sincrónizar",
          "perï¿½metro": "perímetro",
          "perimï¿½tro": "perimétro",
          "fotoelï¿½ctrico": "fotoeléctrico",
          "fotolï¿½ctrico": "fotoléctrico",
          "fotoelectrï¿½co": "fotoelectríco",
          "geomï¿½trico": "geométrico",
          "jeomï¿½trico": "jeométrico",
          "ï¿½ire": "áire",
          "caï¿½sa": "caúsa",
          "acï¿½ite": "acéite",
          "dï¿½uda": "déuda",
          "deudï¿½": "deudá",
          "trapezï¿½ide": "trapezóide",
          "trapezoï¿½de": "trapezoíde",
          "lï¿½mpia": "límpia",
          "limpï¿½a": "limpía",
          "virrï¿½y": "virréy",
          "buï¿½y": "buéy",
          "miï¿½u": "miáu",
          "violï¿½n": "violín",
          "biolï¿½n": "biolín",
          "veolï¿½n": "veolín",
          "poï¿½ma": "poéma",
          "poemï¿½": "poemá",
          "Uruguï¿½y": "Uruguáy",
          "patalï¿½a": "pataléa",
          "pataleï¿½": "pataleá",
          "diciï¿½mbre": "diciémbre",
          "cualidï¿½d": "cualidád",
          "mediï¿½na": "mediána",
          "medianï¿½": "medianá",
          "guayï¿½ba": "guayába",
          "aguacerï¿½": "aguaceró",
          "audï¿½ble": "audíble",
          "detalladamï¿½nte": "detalladaménte",
          "detallï¿½damente": "detalládamente",
          "rï¿½pidamente": "rápidamente",
          "rapidamï¿½nte": "rapidaménte",
          "rapidï¿½mente": "rapidámente",
          "completï¿½mente": "completámente",
          "difï¿½cilmente": "difícilmente",
          "difï¿½silmente": "difísilmente",
          "dificilmï¿½nte": "dificilménte",
          "cuidadï¿½samente": "cuidadósamente",
          "cuidadosï¿½mente": "cuidadosámente",
          "abundï¿½nte": "abundánte",
          "ayudï¿½nte": "ayudánte",
          "tranquilamï¿½nte": "tranquilaménte",
          "tranquilï¿½mente": "tranquilámente",
          "importï¿½nte": "importánte",
          "iguï¿½lmente": "iguálmente",
          "desodorï¿½nte": "desodoránte",
          "calmï¿½nte": "calmánte",
          "desafiï¿½nte": "desafiánte",
          "sutï¿½lmente": "sutílmente",
          "sï¿½tilmente": "sútilmente",
          "cariï¿½osamente": "cariñosamente",
          "cariï¿½ozamente": "cariñozamente",
          "cariï¿½ï¿½samente": "cariñósamente",
          "justamï¿½nte": "justaménte",
          "jï¿½stamente": "jústamente",
          "atentamï¿½nte": "atentaménte",
          "atï¿½ntamente": "aténtamente",
          "cï¿½ntradictorio": "cóntradictorio",
          "biolï¿½n": "biolín",
          "edificï¿½r": "edificár",
          "edï¿½ficar": "edíficar",
          "portafï¿½lios": "portafólios",
          "pï¿½rtafolios": "pórtafolios",
          "terrï¿½stre": "terréstre",
          "terrestrï¿½": "terrestré",
          "dictadï¿½r": "dictadór",
          "exportï¿½r": "exportár",
          "gratificï¿½r": "gratificár",
          "aterrizï¿½r": "aterrizár",
          "atï¿½rrizar": "atérrizar",
          "veredï¿½cto": "veredícto",
          "personificï¿½r": "personificár",
          "pasapï¿½rte": "pasapórte",
          "terrï¿½za": "terráza",
          "dictï¿½r": "dictár",
          "dictï¿½men": "dictámen",
          "terrï¿½no": "terréno",
          "plastificï¿½r": "plastificár",
          "comportamiï¿½nto": "comportamiénto",
          "trï¿½nsporte": "tránsporte",
          "territï¿½rio": "território",
          "continï¿½a": "continúa",
          "kontinï¿½a": "kontinúa",
          "comtinï¿½a": "comtinúa",
          "continï¿½a": "continóa",
          "gradï¿½an": "gradúan",
          "gredï¿½an": "gredúan",
          "graduï¿½r": "graduár",
          "sï¿½ria": "séria",
          "serï¿½a": "sería",
          "serï¿½a": "seréa",
          "cerï¿½a": "cería",
          "serrï¿½a": "serría",
          "zï¿½bia": "zábia",
          "sabï¿½a": "sabía",
          "zabï¿½a": "zabía",
          "zabï¿½a": "zabéa",
          "sabï¿½a": "sabéa",
          "paï¿½s": "país",
          "paï¿½z": "paíz",
          "pï¿½is": "páis",
          "paisï¿½je": "paisáje",
          "sonrï¿½e": "sonríe",
          "sonrrï¿½e": "sonrríe",
          "sonriï¿½": "sonrió",
          "sonrriï¿½": "sonrrió",
          "somriï¿½": "somrió",
          "sonriï¿½ndome": "sonriéndome",
          "sonrriï¿½ndome": "sonrriéndome",
          "sorriï¿½ndome": "sorriéndome",
          "hiervï¿½": "hiervó",
          "austeridï¿½d": "austeridád",
          "veï¿½amos": "veíamos",
          "beï¿½amos": "beíamos",
          "veiï¿½mos": "veiámos",
          "caimï¿½n": "caimán",
          "caemï¿½n": "caemán",
          "cï¿½iman": "cáiman",
          "espï¿½cio": "espácio",
          "cuï¿½rvo": "cuérvo",
          "sirviï¿½nte": "sirviénte",
          "emociï¿½n": "emoción",
          "emosiï¿½n": "emosión",
          "ï¿½mocion": "émocion",
          "mansiï¿½n": "mansión",
          "manciï¿½n": "manción",
          "mï¿½nsion": "mánsion",
          "tensiï¿½n": "tensión",
          "tenciï¿½n": "tención",
          "tï¿½nsion": "ténsion",
          "corrï¿½r": "corrér",
          "alfilï¿½r": "alfilér",
          "ï¿½lfiler": "álfiler",
          "jabalï¿½": "jabalí",
          "gabalï¿½": "gabalí",
          "jï¿½bali": "jábali",
          "sartï¿½n": "sartén",
          "zartï¿½n": "zartén",
          "sï¿½rten": "sárten",
          "audï¿½z": "audáz",
          "ï¿½udaz": "áudaz",
          "ademï¿½s": "además",
          "hademï¿½s": "hademás",
          "ï¿½demas": "ádemas",
          "jamï¿½s": "jamás",
          "gamï¿½s": "gamás",
          "jï¿½mas": "jámas",
          "sofï¿½": "sofá",
          "zofï¿½": "zofá",
          "sï¿½fa": "sófa",
          "hotï¿½l": "hotél",
          "corazï¿½n": "corazón",
          "corasï¿½n": "corasón",
          "cï¿½razon": "córazon",
          "medï¿½r": "medír",
          "allï¿½": "allí",
          "hallï¿½": "hallí",
          "ayï¿½": "ayí",
          "perejï¿½l": "perejíl",
          "pï¿½rejil": "pérejil",
          "millï¿½n": "millón",
          "miyï¿½n": "miyón",
          "mï¿½llon": "míllon",
          "cafï¿½": "café",
          "kafï¿½": "kafé",
          "cï¿½fe": "cáfe",
          "altitï¿½d": "altitúd",
          "ï¿½ltitud": "áltitud",
          "lï¿½piz": "lápiz",
          "lï¿½pis": "lápis",
          "lapï¿½z": "lapíz",
          "fï¿½rtil": "fértil",
          "fï¿½rtel": "fértel",
          "fertï¿½l": "fertíl",
          "ï¿½gil": "ágil",
          "hï¿½gil": "hágil",
          "ï¿½jil": "ájil",
          "agï¿½l": "agíl",
          "ï¿½ngel": "ángel",
          "ï¿½njel": "ánjel",
          "angï¿½l": "angél",
          "ï¿½til": "útil",
          "hï¿½til": "hútil",
          "utï¿½l": "utíl",
          "mï¿½vil": "móvil",
          "mï¿½bil": "móbil",
          "movï¿½l": "movíl",
          "ï¿½rbol": "árbol",
          "hï¿½rbol": "hárbol",
          "arbï¿½l": "arból",
          "azï¿½car": "azúcar",
          "asï¿½car": "asúcar",
          "ï¿½zucar": "ázucar",
          "crï¿½ter": "cráter",
          "cratï¿½r": "cratér",
          "cï¿½sped": "césped",
          "sï¿½sped": "sésped",
          "cespï¿½d": "cespéd",
          "cuï¿½rno": "cuérno",
          "cuernï¿½": "cuernó",
          "encï¿½ma": "encíma",
          "sï¿½na": "sána",
          "cariï¿½osas": "cariñosas",
          "cariï¿½ozas": "cariñozas",
          "cï¿½riï¿½osas": "cáriñosas",
          "valiï¿½nte": "valiénte",
          "palï¿½bra": "palábra",
          "pï¿½labra": "pálabra",
          "cï¿½rcel": "cárcel",
          "cï¿½rsel": "cársel",
          "carcï¿½l": "carcél",
          "hï¿½mbro": "hómbro",
          "estï¿½ndar": "estándar",
          "hestï¿½ndar": "hestándar",
          "estandï¿½r": "estandár",
          "ustï¿½des": "ustédes",
          "ï¿½stedes": "ústedes",
          "ï¿½ltimo": "último",
          "hï¿½ltimo": "húltimo",
          "ultï¿½mo": "ultímo",
          "fï¿½rmula": "fórmula",
          "formï¿½la": "formúla",
          "formulï¿½": "formulá",
          "lï¿½gica": "lógica",
          "lï¿½jica": "lójica",
          "logicï¿½": "logicá",
          "mï¿½gica": "mágica",
          "mï¿½jica": "májica",
          "magï¿½ca": "magíca",
          "parï¿½sito": "parásito",
          "parï¿½cito": "parácito",
          "pï¿½rasito": "párasito",
          "mecï¿½nico": "mecánico",
          "mecï¿½neco": "mecáneco",
          "mï¿½canico": "mécanico",
          "brï¿½jula": "brújula",
          "brï¿½gula": "brúgula",
          "brujï¿½la": "brujúla",
          "vï¿½ndeselo": "véndeselo",
          "vendesï¿½lo": "vendesélo",
          "cï¿½mpraselo": "cómpraselo",
          "comprasï¿½lo": "comprasélo",
          "esdrï¿½jula": "esdrújula",
          "esdrï¿½gula": "esdrúgula",
          "esdrujï¿½la": "esdrujúla",
          "vï¿½monos": "vámonos",
          "vï¿½mosnos": "vámosnos",
          "vamonï¿½s": "vamonós",
          "pï¿½talo": "pétalo",
          "petalï¿½": "petaló",
          "petï¿½lo": "petálo",
          "prï¿½stamelo": "préstamelo",
          "prestamï¿½lo": "prestamélo",
          "prestamelï¿½": "prestameló",
          "tï¿½matelo": "tómatelo",
          "tomatï¿½lo": "tomatélo",
          "tomatelï¿½": "tomateló",
          "cï¿½metelo": "cómetelo",
          "cometï¿½lo": "cometélo",
          "cometelï¿½": "cometeló",
          "lï¿½mina": "lámina",
          "lamï¿½na": "lamína",
          "laminï¿½": "laminá",
          "ï¿½ndice": "índice",
          "ï¿½ndise": "índise",
          "indicï¿½": "indicé",
          "ï¿½nimo": "ánimo",
          "anï¿½mo": "anímo",
          "animï¿½": "animó",
          "ï¿½dolo": "ídolo",
          "idï¿½lo": "idólo",
          "idolï¿½": "idoló",
          "dï¿½melo": "dímelo",
          "dimï¿½lo": "dimélo",
          "dimelï¿½": "dimeló",
          "cobrï¿½zo": "cobrízo",
          "enfï¿½rmiza": "enférmiza",
          "plomï¿½zo": "plomízo",
          "cobï¿½rtizo": "cobértizo",
          "fronterï¿½zo": "fronterízo",
          "primerï¿½za": "primeríza",
          "caballï¿½riza": "caballériza",
          "advenï¿½dizo": "advenédizo",
          "sï¿½": "sí",
          "ssï¿½": "ssí",
          "sï¿½i": "síi",
          "zï¿½": "zí",
          "sï¿½": "sé",
          "sï¿½e": "sée",
          "ssï¿½": "ssé",
          "dï¿½": "dé",
          "ddï¿½": "ddé",
          "dï¿½e": "dée",
          "mï¿½s": "más",
          "mmï¿½s": "mmás",
          "mï¿½as": "máas",
          "mï¿½z": "máz",
          "tï¿½": "té",
          "ttï¿½": "tté",
          "tï¿½e": "tée",
          "ï¿½l": "él",
          "hï¿½l": "hél",
          "hï¿½l": "hél",
          "tï¿½": "tú",
          "tï¿½u": "túu",
          "ttï¿½": "ttú",
          "mï¿½": "mí",
          "mï¿½i": "míi",
          "mmï¿½": "mmí",
          "cï¿½mo": "cómo",
          "cï¿½mmo": "cómmo",
          "cï¿½omo": "cóomo",
          "quï¿½": "qué",
          "quuï¿½": "quué",
          "quï¿½e": "quée",
          "qï¿½": "qé",
          "pasï¿½bamos": "pasábamos",
          "pasï¿½vamos": "pasávamos",
          "pasï¿½abamos": "paséabamos",
          "apretï¿½": "apreté",
          "aprietï¿½": "aprieté",
          "salï¿½": "salí",
          "zalï¿½": "zalí",
          "salï¿½": "salé",
          "partï¿½": "partí",
          "pï¿½rti": "párti",
          "partï¿½": "parté",
          "dejï¿½": "dejé",
          "degï¿½": "degé",
          "dejï¿½": "dejí",
          "comï¿½amos": "comíamos",
          "comiï¿½mos": "comiámos",
          "comï¿½amos": "coméamos",
          "tomï¿½": "tomé",
          "tï¿½me": "tóme",
          "tomï¿½": "tomí",
          "podrï¿½a": "podría",
          "podrï¿½a": "podréa",
          "pondriï¿½": "pondriá",
          "iniciarï¿½a": "iniciaría",
          "inisiarï¿½a": "inisiaría",
          "iniciariï¿½": "iniciariá",
          "sabrï¿½a": "sabría",
          "zabrï¿½a": "zabría",
          "sï¿½bria": "sábria",
          "habrï¿½a": "habría",
          "hï¿½bria": "hábria",
          "saldrï¿½a": "saldría",
          "zaldrï¿½a": "zaldría",
          "saldriï¿½": "saldriá",
          "comerï¿½a": "comería",
          "comï¿½ria": "coméria",
          "comeriï¿½": "comeriá",
          "irï¿½": "iré",
          "tendrï¿½": "tendré",
          "temdrï¿½": "temdré",
          "tï¿½ndre": "téndre",
          "correrï¿½": "correrá",
          "corrï¿½ra": "corréra",
          "cï¿½rrera": "córrera",
          "imaginarï¿½": "imaginaré",
          "imajinarï¿½": "imajinaré",
          "imï¿½ginare": "imáginare",
          "pagarï¿½": "pagaré",
          "pagï¿½re": "pagáre",
          "pï¿½gare": "págare",
          "viajï¿½bamos": "viajábamos",
          "viagï¿½bamos": "viagábamos",
          "viï¿½jabamos": "viájabamos",
          "esconderï¿½": "esconderé",
          "escondï¿½re": "escondére",
          "ï¿½scondere": "éscondere",
          "apetitï¿½sa": "apetitósa",
          "furiï¿½so": "furióso",
          "ï¿½lgebra": "álgebra",
          "ï¿½ljebra": "áljebra",
          "algï¿½bra": "algébra",
          "divï¿½n": "diván",
          "dibï¿½n": "dibán",
          "dï¿½van": "dívan",
          "ï¿½lixir": "élixir",
          "hazaï¿½a": "hazaña",
          "hasaï¿½a": "hasaña",
          "hï¿½zaï¿½a": "házaña",
          "jinï¿½te": "jinéte",
          "jï¿½nete": "jínete",
          "almacï¿½n": "almacén",
          "almasï¿½n": "almasén",
          "almazï¿½n": "almazén",
          "almï¿½cen": "almácen",
          "albï¿½rca": "albérca",
          "nï¿½car": "nácar",
          "nacï¿½r": "nacár",
          "ojalï¿½": "ojalá",
          "hojalï¿½": "hojalá",
          "ï¿½jala": "ójala",
          "gï¿½itarra": "güitarra",
          "guï¿½tarra": "guítarra",
          "tarï¿½ma": "taríma",
          "tï¿½rima": "tárima",
          "bï¿½renjena": "bérenjena",
          "zanï¿½horia": "zanáhoria",
          "barriï¿½": "barrió",
          "gabï¿½n": "gabán",
          "gï¿½ban": "gában",
          "jazmï¿½n": "jazmín",
          "jasmï¿½n": "jasmín",
          "jï¿½zmin": "jázmin",
          "baï¿½o": "baño",
          "baï¿½io": "bañio",
          "zafrï¿½": "zafrá",
          "zï¿½fra": "záfra",
          "combinaciï¿½n": "combinación",
          "conbinaciï¿½n": "conbinación",
          "combinasiï¿½n": "combinasión",
          "combinacï¿½on": "combinacíon",
          "proviï¿½ne": "proviéne",
          "combï¿½tir": "combátir",
          "congestiï¿½n": "congestión",
          "conjestiï¿½n": "conjestión",
          "comgestiï¿½n": "comgestión",
          "congestï¿½on": "congestíon",
          "confraternï¿½r": "confraternár",
          "prosï¿½guir": "proséguir",
          "confirmaciï¿½n": "confirmación",
          "confirmasiï¿½n": "confirmasión",
          "comfirmaciï¿½n": "comfirmación",
          "confirmacï¿½on": "confirmacíon",
          "componï¿½r": "componér",
          "cï¿½mponer": "cómponer",
          "comparï¿½r": "comparár",
          "cï¿½mparar": "cómparar",
          "epï¿½dermis": "epídermis",
          "compartï¿½r": "compartír",
          "compï¿½rtir": "compártir",
          "promï¿½ver": "promóver",
          "epï¿½centro": "epícentro",
          "compï¿½dre": "compádre",
          "compadrï¿½": "compadré",
          "consegï¿½ir": "consegüir",
          "consï¿½guir": "conséguir",
          "proclamï¿½r": "proclamár",
          "proclï¿½mar": "proclámar",
          "sï¿½perabundancia": "súperabundancia",
          "semicï¿½rculo": "semicírculo",
          "semisï¿½rculo": "semisírculo",
          "semicircï¿½lo": "semicircúlo",
          "superdotï¿½do": "superdotádo",
          "sï¿½perdotado": "súperdotado",
          "antiï¿½cido": "antiácido",
          "antiï¿½sido": "antiásido",
          "antiacï¿½do": "antiacído",
          "sï¿½perponer": "súperponer",
          "supervisiï¿½n": "supervisión",
          "superviciï¿½n": "supervición",
          "supervisï¿½on": "supervisíon",
          "antibiï¿½tico": "antibiótico",
          "antebiï¿½tico": "antebiótico",
          "antibiotï¿½co": "antibiotíco",
          "sï¿½perpoblado": "súperpoblado",
          "anticonstï¿½tucional": "anticonstítucional",
          "sobreactuï¿½r": "sobreactuár",
          "sobrecargï¿½": "sobrecargá",
          "semiolvidï¿½do": "semiolvidádo",
          "sobrehumanï¿½": "sobrehumanó",
          "semiacï¿½bado": "semiacábado",
          "sobrenï¿½mbre": "sobrenómbre",
          "sobrenombrï¿½": "sobrenombré",
          "semidï¿½sierto": "semidésierto",
          "sï¿½bremesa": "sóbremesa",
          "anticuï¿½rpo": "anticuérpo",
          "subterrï¿½neo": "subterráneo",
          "subterranï¿½o": "subterranéo",
          "subï¿½ltero": "subáltero",
          "subdï¿½rector": "subdírector",
          "subrï¿½yar": "subráyar",
          "subgrupï¿½": "subgrupó",
          "translï¿½cido": "translúcido",
          "traslï¿½cido": "traslúcido",
          "translï¿½sido": "translúsido",
          "trï¿½nslucido": "tránslucido",
          "subtï¿½tulo": "subtítulo",
          "sutï¿½tulo": "sutítulo",
          "subtitï¿½lo": "subtitúlo",
          "subdividï¿½r": "subdividír",
          "subestimï¿½r": "subestimár",
          "subï¿½stimar": "subéstimar",
          "fotï¿½grafo": "fotógrafo",
          "fotï¿½grefo": "fotógrefo",
          "fï¿½tografo": "fótografo",
          "microbï¿½s": "microbús",
          "microbï¿½z": "microbúz",
          "mï¿½crobus": "mícrobus",
          "telï¿½scopio": "teléscopio",
          "televisiï¿½n": "televisión",
          "televiziï¿½n": "televizión",
          "televiciï¿½n": "televición",
          "telï¿½vision": "telévision",
          "micrï¿½ondas": "micróondas",
          "autï¿½grafo": "autógrafo",
          "ahutï¿½grafo": "ahutógrafo",
          "ï¿½utografo": "áutografo",
          "telï¿½grama": "telégrama",
          "micrï¿½segundo": "micrósegundo",
          "cinematï¿½grafo": "cinematógrafo",
          "sinematï¿½grafo": "sinematógrafo",
          "cinemï¿½tografo": "cinemátografo",
          "microcirugï¿½a": "microcirugía",
          "microsirugï¿½a": "microsirugía",
          "microcirujï¿½a": "microcirujía",
          "micrï¿½cirugia": "micrócirugia",
          "micrï¿½scopio": "micróscopio",
          "telï¿½spectador": "teléspectador",
          "grafologï¿½a": "grafología",
          "grafolojï¿½a": "grafolojía",
          "grafelogï¿½a": "grafelogía",
          "grafï¿½logia": "grafólogia",
          "bibliï¿½grafo": "bibliógrafo",
          "bivliï¿½grafo": "bivliógrafo",
          "bisbliï¿½grafo": "bisbliógrafo",
          "bibliï¿½grafo": "bibliógrafo",
          "microcï¿½nta": "microcínta",
          "telï¿½grafo": "telégrafo",
          "telï¿½grafo": "telógrafo",
          "tï¿½legrafo": "télegrafo",
          "microclï¿½ma": "microclíma",
          "radiotelefonï¿½a": "radiotelefonía",
          "radiotelofononï¿½a": "radiotelofononía",
          "radiotï¿½lefonia": "radiotélefonia",
          "audiciï¿½n": "audición",
          "audisiï¿½n": "audisión",
          "audiziï¿½n": "audizión",
          "ï¿½udision": "áudision",
          "auditï¿½rio": "auditório",
          "ï¿½udio": "áudio",
          "audiï¿½": "audió",
          "inï¿½udible": "ináudible",
          "audiometrï¿½a": "audiometría",
          "ahudiometrï¿½a": "ahudiometría",
          "audiomï¿½tria": "audiométria",
          "abrï¿½pto": "abrúpto",
          "ruptï¿½ra": "ruptúra",
          "interruptï¿½r": "interruptór",
          "exï¿½brupto": "exábrupto",
          "descrï¿½bir": "descríbir",
          "inscribï¿½r": "inscribír",
          "manuscrï¿½be": "manuscríbe",
          "aspï¿½cto": "aspécto",
          "respï¿½cto": "respécto",
          "espectï¿½culo": "espectáculo",
          "expectï¿½culo": "expectáculo",
          "ecspectï¿½culo": "ecspectáculo",
          "ï¿½spectaculo": "éspectaculo",
          "inspecciï¿½n": "inspección",
          "inspexiï¿½n": "inspexión",
          "inspecsiï¿½n": "inspecsión",
          "inspeccï¿½on": "inspeccíon",
          "ï¿½nspector": "ínspector",
          "erupciï¿½n": "erupción",
          "erucciï¿½n": "erucción",
          "erucsiï¿½n": "erucsión",
          "ojeï¿½r": "ojeár",
          "ojï¿½ar": "ojéar",
          "hogeï¿½r": "hogeár",
          "hojï¿½ar": "hojéar",
          "tambiï¿½n": "también",
          "tanbiï¿½n": "tanbién",
          "tï¿½mbien": "támbien",
          "tan biï¿½n": "tan bién",
          "hï¿½ber": "háber",
          "ha vï¿½r": "ha vér",
          "avï¿½r": "avér",
          "asimï¿½smo": "asimísmo",
          "asï¿½mismo": "asímismo",
          "ï¿½simismo": "ásimismo",
          "a sï¿½ mismo": "a sí mismo",
          "ï¿½ si mismo": "á si mismo",
          "sï¿½no": "síno",
          "sinï¿½": "sinó",
          "sï¿½ no": "sí no",
          "si nï¿½": "si nó",
          "tampï¿½co": "tampóco",
          "tï¿½mpoco": "támpoco",
          "tam pï¿½co": "tam póco",
          "tï¿½n poco": "tán poco",
          "hï¿½cho": "hécho",
          "hï¿½hco": "héhco",
          "ï¿½cho": "écho",
          "porqï¿½": "porqé",
          "porqiï¿½": "porqié",
          "por quï¿½": "por qué",
          "pï¿½r quï¿½": "pór qué",
          "pï¿½r que": "pór que",
          "reusï¿½r": "reusár",
          "reuhsï¿½r": "reuhsár",
          "rehï¿½sar": "rehúsar",
          "reï¿½sar": "reúsar",
          "reusï¿½r": "reusár",
          "rï¿½usar": "réusar",
          "en tï¿½rno": "en tórno",
          "ï¿½n torno": "én torno",
          "entï¿½rno": "entórno",
          "ï¿½ntorno": "éntorno",
          "composiciï¿½n": "composición",
          "compociciï¿½n": "compocición",
          "composisiï¿½n": "composisión",
          "composicï¿½on": "composicíon",
          "escenï¿½rio": "escenário",
          "excï¿½ntrico": "excéntrico",
          "exï¿½ntrico": "exéntrico",
          "eccï¿½ntrico": "eccéntrico",
          "fï¿½scinar": "fáscinar",
          "agï¿½jero": "agújero",
          "bohï¿½mio": "bohémio",
          "calï¿½bozo": "calábozo",
          "exchï¿½bir": "exchíbir",
          "pï¿½scuezo": "péscuezo",
          "enhï¿½brar": "enhébrar",
          "grisï¿½ceo": "grisáceo",
          "grisï¿½seo": "grisáseo",
          "grizï¿½ceo": "grizáceo",
          "hï¿½bitat": "hábitat",
          "hï¿½bitad": "hábitad",
          "habitï¿½t": "habitát",
          "hï¿½billa": "hébilla",
          "higiï¿½nico": "higiénico",
          "higï¿½nico": "higénico",
          "hijiï¿½nico": "hijiénico",
          "hipï¿½tesis": "hipótesis",
          "hipï¿½tecis": "hipótecis",
          "ipï¿½tesis": "ipótesis",
          "lombrï¿½z": "lombríz",
          "relojï¿½ro": "relojéro",
          "extermï¿½nador": "extermínador",
          "pï¿½sajero": "pásajero",
          "mï¿½sero": "mésero",
          "carpintï¿½ra": "carpintéra",
          "hormigï¿½ero": "hormigüero",
          "hï¿½rmiguero": "hórmiguero",
          "nï¿½dador": "nádador",
          "remï¿½lcador": "remólcador",
          "despertadï¿½r": "despertadór",
          "despï¿½rtador": "despértador",
          "operadï¿½ra": "operadóra",
          "opï¿½radora": "opéradora",
          "limonï¿½ro": "limonéro",
          "limï¿½nero": "limónero",
          "cochï¿½ra": "cochéra",
          "reparadï¿½ra": "reparadóra",
          "contadï¿½r": "contadór",
          "diseï¿½adora": "diseñadora",
          "deseï¿½adora": "deseñadora",
          "diseï¿½ï¿½dor": "diseñádor",
          "licuadï¿½ra": "licuadóra",
          "licuï¿½dora": "licuádora",
          "calculadï¿½ra": "calculadóra",
          "cï¿½lculadora": "cálculadora",
          "costurï¿½ra": "costuréra",
          "cï¿½sturera": "cósturera",
          "iingenï¿½era": "iingeníera",
          "ï¿½samblea": "ásamblea",
          "bï¿½nquete": "bánquete",
          "cï¿½bina": "cábina",
          "detï¿½lle": "detálle",
          "dï¿½talle": "détalle",
          "chofï¿½r": "chofér",
          "chï¿½fer": "chófer",
          "bebï¿½": "bebé",
          "bevï¿½": "bevé",
          "biebï¿½": "biebé",
          "departamï¿½nto": "departaménto",
          "chï¿½f": "chéf",
          "etï¿½pa": "etápa",
          "flï¿½cha": "flécha",
          "flechï¿½": "flechá",
          "carnï¿½": "carné",
          "carnï¿½d": "carnéd",
          "karnï¿½": "karné",
          "jardï¿½n": "jardín",
          "gardï¿½n": "gardín",
          "jï¿½rdin": "járdin",
          "chaquï¿½ta": "chaquéta",
          "chï¿½queta": "cháqueta",
          "merengï¿½e": "merengüe",
          "mï¿½rengue": "mérengue",
          "nortï¿½": "norté",
          "pantalï¿½n": "pantalón",
          "pantï¿½lon": "pantálon",
          "pï¿½ntalon": "pántalon",
          "aviï¿½n": "avión",
          "haviï¿½n": "havión",
          "ï¿½vion": "ávion",
          "bï¿½jito": "bájito",
          "viï¿½jita": "viéjita",
          "pokitï¿½co": "pokitíco",
          "pï¿½quitico": "póquitico",
          "ratï¿½to": "ratíto",
          "pequeï¿½ita": "pequeñita",
          "pekeï¿½ita": "pekeñita",
          "pequeï¿½itia": "pequeñitia",
          "gatï¿½ta": "gatíta",
          "pisotï¿½n": "pisotón",
          "pizotï¿½n": "pizotón",
          "pisï¿½ton": "pisóton",
          "taconï¿½zo": "taconázo",
          "zapatï¿½nes": "zapatónes",
          "zapatonï¿½s": "zapatonés",
          "respondï¿½n": "respondón",
          "rezpondï¿½n": "rezpondón",
          "respï¿½ndon": "respóndon",
          "grandï¿½te": "grandóte",
          "pelotï¿½zo": "pelotázo",
          "botellï¿½n": "botellón",
          "boteyï¿½n": "boteyón",
          "bï¿½tellon": "bótellon",
          "golï¿½zo": "golázo",
          "golazï¿½": "golazó",
          "golpetï¿½zo": "golpetázo",
          "gï¿½lpetazo": "gólpetazo",
          "grandulï¿½n": "grandulón",
          "grandï¿½lon": "grandúlon",
        };
        return (
          (a = a in o ? o[a] : a),
          (a = a.toLowerCase()),
          (a = a.replace("'", "")),
          (a = a.replace(".", "")),
          (a = a.replace(".", "")),
          (a = a.replace("'", "")),
          (a = a.replace(/ñ/g, "n")),
          (a = a.replace(/á/g, "a")),
          (a = a.replace(/ú/g, "u")),
          (a = a.replace(/í/g, "i")),
          (a = a.replace(/é/g, "e")),
          (a = a.replace(/ó/g, "o")),
          (a = a.replace(/ü/g, "u")),
          (a = a.replace(/ /g, "_")),
          "Homophones" ==
            e.levelGroups[e.currentLevelGroup][e.currentLevel].rule &&
            (a += "_example"),
          "assets/videos/instruction/" + (a += ".mp4")
        );
      }
      var d = !0;
      (e.languageTxt = null),
        (e.screenType = 0),
        (e.isLowerCase = !0),
        (e.isQuerty = !0),
        (e.gameRule = ""),
        (e.showLevelInfo = !1),
        (e.levelInfoAudioActive = !1),
        (e.levelGroups = {}),
        (e.totalGroups = 0),
        (e.totalLevels = 0),
        (e.currentLevelGroup = 1),
        (e.currentLevel = 0),
        (e.zoomedLevel = 0),
        (e.levelScore = 0),
        (e.currentLvlPoints = 0),
        e.levelLaunched,
        (e.capsLock = !1),
        (e.totalScore = 0),
        (e.userScore = 0),
        (e.userName = ""),
        (e.scorePoints = [60, 80, 95]),
        (e.unlockThresh = 70),
        (e.playMode = "easy"),
        e.leafData,
        e.wordSet,
        (e.currentActiveLeaves = []),
        (e.currentOptions = -1),
        e.correctOption,
        e.progress,
        e.creatures,
        e.timer,
        (e.pauseTimer = !1),
        (e.isReload = !1),
        e.popupType,
        (e.ccOn = !1),
        (e.myPopup = !0),
        (e.leafHoverAnim = !1),
        (e.IsVisible = !1),
        (e.audioCallback = {
          thisRef: e,
          params: [],
          type: "end",
          delay: -1,
          arrIndex: -1,
          callbackRef: null,
        }),
        (e.midLevelState = null),
        (e.showReport = !1),
        (e.autoCorrectAnim = !1);
      var p = 2,
        u = [],
        g = !0,
        b = [],
        f = [],
        v = [],
        h = null,
        j = 0,
        z = 1,
        y = "",
        C = "";
      (e.devDesignMode = !1),
        (e.showInstBtn = !1),
        (e.showInstructionOverlay = !1),
        (e.correctOptionsArr = []),
        (e.puzzleWord = []),
        e.keyboardData,
        (e.showCheckAnswerBtn = !1),
        (e.userAttempts = -1),
        (e.highlightPos = []),
        (e.level2Flag = !1),
        (e.showInstructionCaption = !1),
        (e.showRepeatWordBtn = !1),
        (e.showInstOverlay = !1);
      e.currentDropIdx = -1;
      var k = 0;
      (e.isAudioPlaying = !1),
        (e.showEndPopup = !1),
        (e.disableDrop = !1),
        (e.showAllView = !1),
        (e.isLevelClicked = !1),
        (e.showFishAnimation = !1),
        (e.autoFillDropZones = !1),
        (e.responseArrIndex = 0),
        (e.endFloatingBubbles = [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
        ]);
      var A = !1,
        w = [],
        L = "3";
      angular.element(".repeatAudIcon11").hover(
        function () {
          $(".repeatAudIcon11 .imgHov").removeClass("svgIcon"),
            $(".repeatAudIcon11 .imgHov").addClass("svgIconHover");
        },
        function () {
          $(".repeatAudIcon11 .imgHov").removeClass("svgIconHover"),
            $(".repeatAudIcon11 .imgHov").addClass("svgIcon");
        }
      ),
        angular.element(".aslInstructionVideoBtn").hover(
          function () {
            $(".imgHovHand").removeClass("svgHandIcon"),
              $(".imgHovHand").addClass("svgHandIconHover");
          },
          function () {
            $(".imgHovHand").removeClass("svgHandIconHover"),
              $(".imgHovHand").addClass("svgHandIcon");
          }
        ),
        angular.element(".aslIntroInstructionVideoBtn").hover(
          function () {
            $(".aslIcon").removeClass("svgHandIcon"),
              $(".aslIcon").addClass("svgHandIconHover");
          },
          function () {
            $(".aslIcon").removeClass("svgHandIconHover"),
              $(".aslIcon").addClass("svgHandIcon");
          }
        ),
        e.$on(a.ACTIVITY_LOADED, function () {
          e.init(), t();
        }),
        e.$on(a.RESIZE, function () {
          t();
        }),
        e.$on(a.ORIENTATION, function () {
          o(function () {
            t();
          }, 500);
        }),
        (e.ShowHide = function () {
          e.IsVisible = !0;
        }),
        (e.init = function () {
          (L = e.$parent.appData.grade),
            (e.gameGrade = L),
            (e.language = e.$parent.appData.language),
            (e.languageTxt =
              e.$parent.appData.lang_txt[e.$parent.appData.language]),
            e.processRawDB(),
            (g = !1),
            e.$emit("initAccessibility"),
            3 == e.gameGrade || 4 == e.gameGrade
              ? (e.activeLeafSet = {
                  easy: [1, 1, 1],
                  challenge: [1, 1, 1, 1, 1],
                })
              : 5 == e.gameGrade &&
                (e.activeLeafSet = {
                  easy: [1, 1, 1, 1],
                  challenge: [1, 1, 1, 1, 1],
                }),
            (e.keysAllowed = [
              "a",
              "b",
              "c",
              "d",
              "e",
              "f",
              "g",
              "h",
              "i",
              "j",
              "k",
              "l",
              "m",
              "n",
              "o",
              "p",
              "q",
              "r",
              "s",
              "t",
              "u",
              "v",
              "w",
              "x",
              "y",
              "z",
              "bs",
              "left",
              "right",
              "SingleQuote",
              "FullStop",
              "A",
              "B",
              "C",
              "D",
              "E",
              "F",
              "G",
              "H",
              "I",
              "J",
              "K",
              "L",
              "M",
              "N",
              "O",
              "P",
              "Q",
              "R",
              "S",
              "T",
              "U",
              "V",
              "W",
              "X",
              "Y",
              "Z",
            ]),
            $(window).on("keydown", function (a) {
              if ("challenge" == e.playMode) {
                if (e.disableDrop) return;
                var o = a.key;
                (8 != a.keyCode &&
                  "8" != a.keyCode &&
                  46 != a.keyCode &&
                  "46" != a.keyCode) ||
                  (o = "bs"),
                  (37 != a.keyCode && "37" != a.keyCode) || (o = "left"),
                  (39 != a.keyCode && "39" != a.keyCode) || (o = "right"),
                  (222 != a.keyCode && "222" != a.keyCode) ||
                    (o = "SingleQuote"),
                  (190 != a.keyCode && "190" != a.keyCode) || (o = "FullStop"),
                  e.keysAllowed.indexOf(o) >= 0 &&
                    ("bs" == o
                      ? k < 2 && e.deleteLetter()
                      : "left" == o
                      ? (e.currentDropIdx = Math.max(0, e.currentDropIdx - 1))
                      : "right" == o
                      ? (e.currentDropIdx = Math.min(
                          e.puzzleWord.length - 1,
                          e.currentDropIdx + 1
                        ))
                      : e.showLetterInDropBox("", "", o)),
                  13 == a.keyCode &&
                    $(".checkAnserBtn").is(":visible") &&
                    e.checkAnswerClick(),
                  e.$apply();
              }
            }),
            e.$parent.appData.data.tincan.restoreGame
              ? (console.log("$scope.showCheckAnswerBtn", e.showCheckAnswerBtn),
                console.log("correctOptionsArr", e.correctOptionsArr),
                e.restoreGameState(),
                (e.isReload = !0),
                (e.showInstBtn = !0),
                !1 === e.isQuerty &&
                  o(function () {
                    angular
                      .element(".onscreenKeyboard .row1 .dragItems")
                      .removeClass("querty_" + e.language + "_row1"),
                      angular
                        .element(".onscreenKeyboard .row2")
                        .removeClass("querty_" + e.language + "_row2"),
                      angular
                        .element(".onscreenKeyboard .row3")
                        .removeClass("querty_" + e.language + "_row3"),
                      angular
                        .element(".onscreenKeyboard .row4")
                        .removeClass("querty_" + e.language + "_row4");
                  }, 500))
              : (e.setupLevelGroups(), e.showHomeScreen()),
            AccessibilityManager.registerActionHandler(
              "slectSaveAndExit",
              "",
              "",
              function () {
                e.$broadcast("togglepopup", "reload_" + e.language),
                  o(function () {
                    AccessibilityManager.setTabGroup("saveAndExitPopup"),
                      AccessibilityManager.updateTabOrder(
                        "saveAndExitPopup",
                        function () {
                          AccessibilityManager.setFocus(
                            ".popupContainer .textContainer .innerText"
                          );
                        }
                      );
                  }, 400);
              }
            ),
            e.$parent.appData.data.tincan.restoreGame ||
              (e.levelGroups[e.currentLevelGroup][
                e.currentLevel
              ].modes.challenge.active = !1);
        }),
        (e.setupIdleTimer = function () {
          z = 0;
          var a = "goahead";
          (e.idleInterval = r(function () {
            z++,
              3 == e.screenType &&
                z > 0 &&
                z % 30 == 0 &&
                (e.$broadcast("playAudio", a, null),
                (a = "goahead" == a ? "keepgoing" : "goahead"),
                (z = 0));
          }, 1e3)),
            angular.element(document).on("mousemove", function () {
              z = 0;
            }),
            angular.element(document).on("touchstart", function () {
              z = 0;
            });
        }),
        (e.playClick = function () {
          !0 !== g &&
            (e.$broadcast("stopAudio"),
            e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.delay = 0),
            (e.gameStartTime = new Date()),
            (e.audioCallback.callbackRef = function () {
              e.enableFirstLevel(),
                (e.screenType = 2),
                (e.showAllView = !0),
                (e.showInstructionsAfterAnim = !0),
                o(function () {
                  var a = $(".allLevelsView .levelIsland")[e.zoomedLevel],
                    r = a.getBoundingClientRect(),
                    i = $(".allLevelsView")[0].getBoundingClientRect(),
                    n =
                      (r.left,
                      i.left,
                      r.top,
                      i.top,
                      $(".connectingProgression")[0]);
                  $(n).css({
                    "-webkit-transform-origin": r.left + "px " + r.top + "px",
                    "-moz-transform-origin": r.left + "px " + r.top + "px",
                    "-ms-transform-origin": r.left + "px " + r.top + "px",
                    "transform-origin": r.left + "px " + r.top + "px",
                  }),
                    $(n).removeClass("animationEndState"),
                    $(n).addClass("allLevelAnimation"),
                    o(function () {
                      $(n).addClass("animationEndState"),
                        e.allViewClick(e.currentLevelGroup),
                        o(function () {
                          $(n).removeClass("allLevelAnimation"),
                            o(function () {
                              AccessibilityManager.setTabGroup(
                                "levelScreenInstruction"
                              ),
                                AccessibilityManager.updateTabOrder(
                                  "levelScreenInstruction",
                                  function () {
                                    AccessibilityManager.setFocus(
                                      ".playLevelInformation span"
                                    );
                                  }
                                );
                            }, 400);
                        }, 2500);
                    }, 2500);
                }, 100);
            }),
            e.$broadcast("playAudio", "click", e.audioCallback));
        }),
        (e.splashAudioClick = function () {
          e.$broadcast("stopAudio"),
            e.refreshAudioCallbackObj(),
            e.$broadcast("playAudio", "intro", null);
        }),
        (e.allViewClick = function (a) {
          (e.currentLevelGroup = a),
            (e.showAllView = !1),
            o(function () {
              e.showInstructionsAfterAnim = !1;
            }, 600),
            e.showLevelScreen();
        }),
        (e.showHomeScreen = function (o) {
          (g = !1),
            (e.screenType = 1),
            angular.forEach(e.$parent.appData.allViewPos, function (a, o) {
              (e.allLevels[o + 1].pos = {}),
                (e.allLevels[o + 1].pos.top = a.top),
                (e.allLevels[o + 1].pos.left = a.left);
            }),
            AccessibilityManager.updateTabOrder("splashScreen", function () {
              AccessibilityManager.setFocus(".splashScreen .playBtn");
            }),
            e.refreshAudioCallbackObj(),
            o || e.$broadcast("playAudio", "intro", null),
            e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.showLevelScreen = function () {
          (e.screenType = 2),
            1 == A
              ? ((e.showInstBtn = !0),
                (e.showInstOverlay = !1),
                (e.showInstructionCaption = !1),
                (A = !1))
              : ((e.showInstBtn = !1),
                e.refreshAudioCallbackObj(),
                (e.audioCallback.type = "end"),
                (e.showInstOverlay = !0),
                (e.showInstructionCaption = !0),
                (e.audioCallback.callbackRef = function () {
                  (e.showInstBtn = !0),
                    e.$broadcast("stopVideo"),
                    (e.IsVisible = !1),
                    (e.showInstOverlay = !1),
                    (e.showInstructionCaption = !1);
                }),
                e.$broadcast("playAudio", "letsgo", e.audioCallback)),
            AccessibilityManager.updateTabOrder("levelScreen", function () {
              AccessibilityManager.setFocus($(".levelMode")[0]);
            }),
            e.$emit(a.SAVE_TINCAN_DATA),
            t();
        }),
        (e.showQnsScreen = function () {
          (e.screenType = 3),
            e.restoreMidLevelState(),
            (e.leafData = e.$parent.appData.leafData[e.playMode]),
            e.loadNextQuestion(),
            e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.backToLevelScreen = function () {
          1 != g &&
            ((g = !1),
            e.$broadcast("stopAudio"),
            (A = !0),
            e.showLevelScreen());
        }),
        (e.lvlbackBtnClick = function () {
          1 != g && e.showHomeScreen(!0);
        }),
        (e.setupLevelGroups = function () {
          (e.totalGroups = 0),
            (e.totalLevels = 0),
            (e.levelGroups = {}),
            (e.allLevels = e.$parent.appData.levelData),
            angular.forEach(e.$parent.appData.levelData, function (a, o) {
              if (((a.rule = e.ruleSet[o - 1]), !a.group))
                return (
                  console.log(
                    "Invalid JSON. Level group missing --- " + o + " --- " + a
                  ),
                  void (d = !1)
                );
              e.levelGroups.hasOwnProperty(a.group)
                ? ((a.level = o),
                  (a.name = e.languageTxt.islands[parseInt(o) - 1]),
                  angular.forEach(a.modes, function (a, o) {
                    (a.modeName = e.languageTxt.modeName[o]),
                      (a.date = ""),
                      (a.timeSpent = ""),
                      (a.percentComplete = "0%"),
                      (a.isPass = "No"),
                      (a.responses = []);
                  }),
                  e.levelGroups[a.group].push(a),
                  (e.totalLevels = e.totalLevels + 1))
                : ((e.totalGroups = e.totalGroups + 1),
                  (e.levelGroups[a.group] = []),
                  (a.level = o),
                  (a.name = e.languageTxt.islands[parseInt(o) - 1]),
                  angular.forEach(a.modes, function (a, o) {
                    (a.modeName = e.languageTxt.modeName[o]),
                      (a.date = ""),
                      (a.timeSpent = ""),
                      (a.percentComplete = "0%"),
                      (a.isPass = "No"),
                      (a.responses = []);
                  }),
                  e.levelGroups[a.group].push(a),
                  (e.totalLevels = e.totalLevels + 1));
            });
        }),
        (e.enableFirstLevel = function () {
          1 == e.currentLevelGroup &&
            0 == e.currentLevel &&
            ((e.totalScore = e.totalScore + 3 * e.scorePoints.length),
            (e.levelGroups[e.currentLevelGroup][
              e.currentLevel
            ].modes.easy.active = !0));
        }),
        (e.restoreGameState = function () {
          (j = e.$parent.appData.data.tincan.total_score),
            (h = e.$parent.appData.data.tincan.savedState),
            (e.currentLevelGroup = h.levelGroup),
            (e.currentLevel = parseInt(h.level) - 1),
            (e.totalGroups = h.totalGroups),
            (e.totalLevels = h.totalLevels),
            (e.totalScore = h.totalScore),
            (e.userScore = h.userScore),
            (e.levelGroups = h.levelGroups),
            (e.midLevelState = h.midLevelState),
            (e.allLevels = h.allViewState),
            (e.currentOptions = h.currentIndex),
            (e.wordSet = h.wordSet),
            (e.playMode = h.mode),
            (e.gameStartTime = new Date(h.gameStartTime)),
            (e.levelEndTime = new Date(h.levelEndTime)),
            (b = e.wordSet),
            (e.leafData = h.leafData),
            (e.puzzleWord = h.puzzleWord),
            (e.correctOptionsArr = h.correctOptionArray),
            (e.levelScore = h.levelScore),
            (e.levelLaunched = h.levelLaunched),
            (e.isQuerty = h.isQuerty);
          try {
            e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[e.playMode]
              .responses &&
              (w =
                e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].responses);
          } catch (e) {}
          o(function () {
            if ("review" === TincanManager.mode) e.showHomeScreen();
            else
              switch (h.screenType) {
                case 1:
                  e.showHomeScreen();
                  break;
                case 2:
                  e.showLevelScreen();
                  break;
                case 3:
                  e.showQnsScreen();
              }
          }, 500);
        }),
        (e.saveGameState = function () {
          e.setupMidLevelStateObj(),
            (e.$parent.appData.data.tincan.savedState = {
              screenType: e.screenType,
              levelGroup: e.currentLevelGroup,
              level: parseInt(e.currentLevel) + 1,
              totalGroups: e.totalGroups,
              totalLevels: e.totalLevels,
              totalScore: e.totalScore,
              userScore: e.userScore,
              levelGroups: e.levelGroups,
              midLevelState: e.midLevelState,
              allViewState: e.allLevels,
              midLevelState: e.midLevelState,
              currentIndex: e.currentOptions,
              wordSet: e.wordSet,
              levelScore: e.levelScore,
              score: e.levelScore,
              levelLaunched: e.levelLaunched,
              mode: e.playMode,
              gameStartTime: e.gameStartTime,
              levelEndTime: e.levelEndTime,
              leafData: e.leafData,
              puzzleWord: e.puzzleWord,
              correctOptionArray: e.correctOptionsArr,
              isQuerty: e.isQuerty,
            });
        }),
        (e.setupMidLevelStateObj = function () {
          3 == e.screenType
            ? (e.midLevelState = {
                levelLaunched: e.levelLaunched,
                points: e.currentLvlPoints,
                score: e.levelScore,
                levelScore: e.levelScore,
                mode: e.playMode,
                wordset: e.wordSet,
                currentIndex: parseInt(e.currentOptions) - 1,
                progress: e.progress,
                timeLimit: e.timeLimit,
                correctOptionArray: e.correctOptionsArr,
                puzzleWord: e.puzzleWord,
                keyboardData: e.keyboardData,
                wordSets: e.wordSet,
                gameStartTime: e.gameStartTime,
                userScore: e.userScore,
                levelEndTime: e.levelEndTime,
                leafData: e.leafData,
                levelGroups: e.levelGroups,
                isQuerty: e.isQuerty,
                totalScore: e.totalScore,
              })
            : (e.midLevelState = null);
        }),
        (e.restoreMidLevelState = function () {
          (e.levelLaunched = e.midLevelState.levelLaunched),
            (e.currentLvlPoints = e.midLevelState.points),
            (e.levelScore = e.midLevelState.score),
            (e.playMode = e.midLevelState.mode),
            (e.wordSet = e.midLevelState.wordset),
            (e.currentOptions = e.midLevelState.currentIndex),
            (e.progress = e.midLevelState.progress),
            (e.timeLimit = e.midLevelState.timeLimit),
            (e.correctOptionsArr = e.midLevelState.correctOptionArray),
            (e.puzzleWord = e.midLevelState.puzzleWord),
            (e.keyboardData = e.midLevelState.keyboardData),
            (e.wordSet = e.midLevelState.wordSets),
            (e.gameStartTime = new Date(e.midLevelState.gameStartTime)),
            (e.userScore = e.midLevelState.userScore),
            (e.levelEndTime = new Date(e.midLevelState.levelEndTime)),
            (e.leafData = e.midLevelState.leafData),
            (e.levelGroups = e.midLevelState.levelGroups),
            (e.levelScore = e.midLevelState.levelScore),
            (e.isQuerty = e.midLevelState.isQuerty),
            (e.totalScore = e.midLevelState.totalScore);
        }),
        (e.levelClick = function (r, i, n, t, s) {
          if (
            angular.element(r.target).hasClass("locked") ||
            -1 != e.currentOptions
          )
            e.startGamePlay(),
              AccessibilityManager.setTabGroup("playScreenInstruction"),
              AccessibilityManager.updateTabOrder(
                "playScreenInstruction",
                function () {
                  AccessibilityManager.setFocus(".playscreenIns span");
                }
              );
          else {
            if (
              ((e.gameStartTime = new Date()),
              (e.zoomedLevel = s),
              (e.isLevelClicked = !0),
              (e.showFishAnimation = !1),
              "challenge" == n &&
                angular.element(".wordContainer").find(".leaf").remove(),
              angular.element(".endLevelFishes").css("display", "none"),
              (r && angular.element(r.currentTarget).hasClass("locked")) ||
                !0 === g)
            )
              return;
            if (!0 === g) return;
            g = !0;
            var c = 0;
            switch (n) {
              case "easy":
                c = 1;
                break;
              case "medium":
                c = 2;
                break;
              case "challenge":
                c = 3;
            }
            (j = j + c),
              (e.levelLaunched = i),
              (e.currentLevel = s),
              (e.levelScore = 0),
              (e.currentLvlPoints = 0),
              (e.percentComplete = 0),
              (e.playMode = n),
              (e.time = ""),
              (e.pauseTimer = !1),
              (e.wordSet = l(
                e.$parent.appData.data.dataset[e.$parent.appData.language][
                  i
                ].slice()
              )),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].wordset = e.wordSet),
              (w = e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].responses
                ? e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                    e.playMode
                  ].responses
                : []),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].responses = []),
              (e.startLevelTime = new Date()),
              (e.correctOptionsArr = []);
            for (var m = 0; m < e.wordSet.length; m++)
              e.correctOptionsArr.push({ word: "", attempts: -1 }),
                e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                  e.playMode
                ].responses.push({ target: "", attempt1: "-", attempt2: "-" });
            (e.showEndPopup = !1),
              e.refreshAudioCallbackObj(),
              (e.audioCallback.type = "end"),
              (e.audioCallback.callbackRef = function () {
                (g = !1), e.startGamePlay();
              }),
              e.$emit(a.SAVE_TINCAN_DATA),
              e.$broadcast("playAudio", "click", e.audioCallback),
              o(function () {
                AccessibilityManager.setTabGroup("playScreenInstruction"),
                  AccessibilityManager.updateTabOrder(
                    "playScreenInstruction",
                    function () {
                      AccessibilityManager.setFocus(".playscreenIns span");
                    }
                  );
              }, 400);
          }
        }),
        (e.startGamePlay = function () {
          (e.leafData = e.$parent.appData.leafData[e.playMode]),
            (e.keyboardData =
              e.$parent.appData[
                "keyboardData_" + e.language + "_lowerCase_querty"
              ]),
            o(function () {
              angular
                .element(".onscreenKeyboard .row1 .dragItems")
                .addClass("querty_" + e.language + "_row1"),
                angular
                  .element(".onscreenKeyboard .row2")
                  .addClass("querty_" + e.language + "_row2"),
                angular
                  .element(".onscreenKeyboard .row3")
                  .addClass("querty_" + e.language + "_row3"),
                angular
                  .element(".onscreenKeyboard .row4")
                  .addClass("querty_" + e.language + "_row4");
            }, 100),
            (e.screenType = 3),
            -1 == e.currentOptions &&
              ((e.currentOptions = -1),
              (e.progress = 0),
              (b = []),
              (f = []),
              (v = []),
              angular.forEach(e.wordSet, function (e) {
                b.push(e[0]);
              }),
              (e.doActionBeforeAudio = !1)),
            "challenge" == e.playMode
              ? ((e.currentDropIdx = 0),
                (e.showInstBtn = !1),
                (e.doActionBeforeAudio = !0),
                e.refreshAudioCallbackObj(),
                (g = !0),
                (e.audioCallback.type = "end"),
                (e.audioCallback.callbackRef = function () {
                  (g = !1),
                    (e.showInstBtn = !0),
                    (e.doActionBeforeAudio = !1),
                    -1 == e.currentOptions
                      ? e.loadNextQuestion()
                      : ((e.pauseTimer = !1),
                        e.refreshAudioCallbackObj(),
                        (e.audioCallback.type = "end"),
                        (e.audioCallback.callbackRef = e.closePopUpAudioWord),
                        (e.audioCallback.delay = -1),
                        e.$broadcast("stopAudio"),
                        e.$broadcast("playAudio", "appear", e.audioCallback));
                }),
                e.$broadcast("playAudio", "level2Info", e.audioCallback))
              : ((e.currentDropIdx = -1),
                (e.doActionBeforeAudio = !0),
                e.refreshAudioCallbackObj(),
                (e.showInstructionCaption = !0),
                (e.showInstBtn = !1),
                (e.showInstOverlay = !0),
                (g = !0),
                (e.audioCallback.callbackRef = function () {
                  e.gameGrade < 5 && angular.element("#3").hide(),
                    (e.showInstructionCaption = !1),
                    (e.showRepeatWordBtn = !0),
                    (e.showInstBtn = !0),
                    e.$broadcast("stopVideo"),
                    (e.IsVisible = !1),
                    (e.showInstOverlay = !1),
                    (g = !1),
                    (e.doActionBeforeAudio = !1),
                    -1 == e.currentOptions
                      ? e.loadNextQuestion()
                      : (e.refreshAudioCallbackObj(),
                        (e.audioCallback.type = "end"),
                        (e.audioCallback.callbackRef = e.setupNextQns),
                        (e.audioCallback.delay = -1),
                        e.$broadcast("stopAudio"),
                        e.$broadcast("playAudio", "appear", e.audioCallback));
                }),
                e.$broadcast("playAudio", "level1Info", e.audioCallback)),
            e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.capsBtnClick = function () {
          angular.element(".onscreenKeyboard").fadeOut(50),
            e.isQuerty
              ? (e.isLowerCase
                  ? (e.keyboardData =
                      e.$parent.appData[
                        "keyboardData_" + e.language + "_querty"
                      ])
                  : (e.keyboardData =
                      e.$parent.appData[
                        "keyboardData_" + e.language + "_lowerCase_querty"
                      ]),
                o(function () {
                  angular
                    .element(".onscreenKeyboard .row1 .dragItems")
                    .addClass("querty_" + e.language + "_row1"),
                    angular
                      .element(".onscreenKeyboard .row2")
                      .addClass("querty_" + e.language + "_row2"),
                    angular
                      .element(".onscreenKeyboard .row3")
                      .addClass("querty_" + e.language + "_row3"),
                    angular
                      .element(".onscreenKeyboard .row4")
                      .addClass("querty_" + e.language + "_row4");
                }, 100))
              : (e.isLowerCase
                  ? (e.keyboardData =
                      e.$parent.appData["keyboardData_" + e.language])
                  : (e.keyboardData =
                      e.$parent.appData[
                        "keyboardData_" + e.language + "_lowerCase"
                      ]),
                o(function () {
                  angular
                    .element(".onscreenKeyboard .row1 .dragItems")
                    .removeClass("querty_" + e.language + "_row1"),
                    angular
                      .element(".onscreenKeyboard .row2")
                      .removeClass("querty_" + e.language + "_row2"),
                    angular
                      .element(".onscreenKeyboard .row3")
                      .removeClass("querty_" + e.language + "_row3"),
                    angular
                      .element(".onscreenKeyboard .row4")
                      .removeClass("querty_" + e.language + "_row4");
                }, 100)),
            (e.isLowerCase = !e.isLowerCase),
            angular.element(".onscreenKeyboard").fadeIn(200),
            e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.changeKeypad = function () {
          angular.element(".onscreenKeyboard").fadeOut(50),
            e.isQuerty
              ? (e.isLowerCase
                  ? (e.keyboardData =
                      e.$parent.appData[
                        "keyboardData_" + e.language + "_lowerCase"
                      ])
                  : (e.keyboardData =
                      e.$parent.appData["keyboardData_" + e.language]),
                o(function () {
                  angular
                    .element(".onscreenKeyboard .row1 .dragItems")
                    .removeClass("querty_" + e.language + "_row1"),
                    angular
                      .element(".onscreenKeyboard .row2")
                      .removeClass("querty_" + e.language + "_row2"),
                    angular
                      .element(".onscreenKeyboard .row3")
                      .removeClass("querty_" + e.language + "_row3"),
                    angular
                      .element(".onscreenKeyboard .row4")
                      .removeClass("querty_" + e.language + "_row4");
                }, 100))
              : (e.isLowerCase
                  ? (e.keyboardData =
                      e.$parent.appData[
                        "keyboardData_" + e.language + "_lowerCase_querty"
                      ])
                  : (e.keyboardData =
                      e.$parent.appData[
                        "keyboardData_" + e.language + "_querty"
                      ]),
                o(function () {
                  angular
                    .element(".onscreenKeyboard .row1 .dragItems")
                    .addClass("querty_" + e.language + "_row1"),
                    angular
                      .element(".onscreenKeyboard .row2")
                      .addClass("querty_" + e.language + "_row2"),
                    angular
                      .element(".onscreenKeyboard .row3")
                      .addClass("querty_" + e.language + "_row3"),
                    angular
                      .element(".onscreenKeyboard .row4")
                      .addClass("querty_" + e.language + "_row4");
                }, 100)),
            (e.isQuerty = !e.isQuerty),
            angular.element(".onscreenKeyboard").fadeIn(200),
            e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.closeInstructionPanelOutside = function (a) {
          if (((e.IsVisible = !1), !$(a.target).hasClass("ignoreClose"))) {
            if (
              ((e.showInstructionCaption = !1),
              (e.showRepeatWordBtn = !0),
              (e.showInstBtn = !0),
              (e.showInstOverlay = !1),
              e.$broadcast("stopAudio"),
              e.$broadcast("stopVideo"),
              (g = !1),
              1 == e.doActionBeforeAudio)
            ) {
              e.doActionBeforeAudio = !1;
              var r = e.audioCallback;
              r &&
                r.callbackRef &&
                "end" == r.type &&
                (r.delay >= 0
                  ? o(function () {
                      r.callbackRef.apply(r.thisRef, r.params);
                    }, r.delay)
                  : r.callbackRef.apply(r.thisRef, r.params));
            }
            AccessibilityManager.panelCloseHandler(),
              AccessibilityManager.updateTabOrder("levelScreen", function () {
                AccessibilityManager.setFocus(
                  ".levelScreenNav .levelInstructionBtn"
                );
              });
          }
        }),
        (e.closeInstructionPanel = function (a) {
          if (
            (e.gameGrade < 5 && angular.element("#3").hide(),
            (e.IsVisible = !1),
            !$(a.target).hasClass("ignoreClose"))
          ) {
            if (
              ((e.showInstructionCaption = !1),
              (e.showRepeatWordBtn = !0),
              (e.showInstBtn = !0),
              (e.showInstOverlay = !1),
              e.$broadcast("stopAudio"),
              e.$broadcast("stopVideo"),
              (g = !1),
              1 == e.doActionBeforeAudio)
            ) {
              e.doActionBeforeAudio = !1;
              var r = e.audioCallback;
              r &&
                r.callbackRef &&
                "end" == r.type &&
                (r.delay >= 0
                  ? o(function () {
                      r.callbackRef.apply(r.thisRef, r.params);
                    }, r.delay)
                  : r.callbackRef.apply(r.thisRef, r.params));
            }
            AccessibilityManager.panelCloseHandler(),
              AccessibilityManager.updateTabOrder("levelScreen", function () {
                AccessibilityManager.setFocus(
                  ".levelScreenNav .levelInstructionBtn"
                );
              }),
              e.refreshAudioCallbackObj(),
              (e.audioCallback.type = "end"),
              (e.audioCallback.callbackRef = e.closePopUpAudioWord),
              (e.audioCallback.delay = -1),
              e.$broadcast("stopAudio"),
              e.$broadcast("playAudio", "appear", e.audioCallback);
          }
        }),
        (e.closePopUpAudioWord = function () {
          (e.currentActiveLeaves = e.activeLeafSet[e.playMode].slice()),
            (e.correctOption = e.wordSet[e.currentOptions][0]);
          for (var r = 0; r < e.currentActiveLeaves.length; )
            1 == e.currentActiveLeaves[r] &&
              (e.currentActiveLeaves[r] = e.wordSet[e.currentOptions][r]),
              r++;
          l(e.currentActiveLeaves),
            e.generateCreatures(),
            (k = 0),
            o(function () {
              e.$broadcast("stopAudio");
              var o;
              (o =
                "challenge" == e.playMode && "es" == e.language
                  ? "escribe"
                  : "find"),
                (u = [o, s(e.correctOption)]),
                e.playCurrentWord(),
                AccessibilityManager.updateTabOrder("playScreen", function () {
                  AccessibilityManager.setFocus($(".leafCover.active")[0]);
                }),
                e.$emit(a.SAVE_TINCAN_DATA);
            }, 0);
        }),
        (e.closeInstructionPanelAsl = function (a) {
          (e.IsVisible = !1),
            $(a.target).hasClass("ignoreClose") ||
              ((e.showInstructionCaption = !1),
              (e.showRepeatWordBtn = !0),
              (e.showInstBtn = !0),
              (e.showInstOverlay = !1),
              (g = !1));
        }),
        (e.instructionAudioBtnClick = function () {
          1 != g &&
            (e.$broadcast("stopAudio"),
            (g = !1),
            e.refreshAudioCallbackObj(),
            "2" == e.screenType && e.$broadcast("playAudio", "letsgo"),
            "easy" == e.playMode && e.$broadcast("playAudio", "level1Info"),
            "challenge" == e.playMode &&
              e.$broadcast("playAudio", "level2Info"));
        }),
        (e.instructBtnClickHandler = function (a) {
          1 != g &&
            ((e.IsVisible = !1),
            e.$broadcast("stopAudio"),
            (g = !1),
            (e.showInstOverlay = !0),
            e.refreshAudioCallbackObj(),
            (e.showInstructionCaption = !0),
            (e.showInstBtn = !1),
            o(function () {
              2 == e.screenType
                ? (AccessibilityManager.setTabGroup("levelScreenInstruction"),
                  AccessibilityManager.updateTabOrder(
                    "levelScreenInstruction",
                    function () {
                      AccessibilityManager.setFocus(
                        ".playLevelInformation span"
                      );
                    }
                  ))
                : 3 == e.screenType &&
                  (AccessibilityManager.setTabGroup("playScreenInstruction"),
                  AccessibilityManager.updateTabOrder(
                    "playScreenInstruction",
                    function () {
                      AccessibilityManager.setFocus(
                        ".playLevelInformation span"
                      );
                    }
                  ));
            }, 400));
        }),
        (e.closeInfoBtn = function () {
          (e.showInstructionOverlay = !1), (e.showInstBtn = !0);
        }),
        (e.loadNextQuestion = function () {
          if (
            ((e.highlightPos = []),
            e.currentOptions++,
            (e.autoCorrectAnim = !1),
            (e.showCheckAnswerBtn = !1),
            (e.isLetterPresent = !1),
            (e.isLevelClicked = !1),
            (e.autoFillDropZones = !1),
            (e.showFishAnimation = !1),
            angular.element(".endLevelFishes").css("display", "none"),
            $(".leaf").show(),
            $(".active").show(),
            $(".leafCover").removeClass("bubbleBustAnim"),
            $(".leaf").removeClass("selectedLeaf"),
            $(".wordDrops").removeClass(
              "letterDroppedIn disableDiv transparentDiv"
            ),
            angular
              .element(".wordContainer .leafCover")
              .removeClass("disableOptions"),
            (3 != e.gameGrade && 4 != e.gameGrade) ||
              angular
                .element(".wordContainer")
                .find(".leaf:last")
                .css("display", "none"),
            (e.currentDropIdx = 0),
            e.currentOptions >= e.wordSet.length)
          )
            e.levelCompleteHandle();
          else {
            -1 === e.currentOptions && (e.currentOptions = 0);
            var o = e.wordSet[e.currentOptions][0];
            (e.puzzleWord = o.split("")), (e.userAttempts = -1);
            for (var r = 0; r < $(".wordDrops").length; r++)
              $($(".wordDrops")[r]).empty();
            angular.forEach(e.currentActiveLeaves, function (a, o) {
              e.currentActiveLeaves[o] = "";
            }),
              (e.creatures = []),
              e.setupNextQns(),
              (e.levelScore = (function (e, a) {
                for (var o = 0, r = 0; r < a.length; r++)
                  "attempts" in a[r] && a[r].attempts === e && o++;
                return o;
              })(2, e.correctOptionsArr));
            var i =
              e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score;
            e.levelScore > i &&
              ((e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score = e.levelScore),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].percentComplete =
                (100 * e.levelScore) / e.wordSet.length + "%"),
              (e.userScore = e.userScore + (e.levelScore - i)));
          }
          e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.setupNextQns = function () {
          (e.currentActiveLeaves = e.activeLeafSet[e.playMode].slice()),
            (e.correctOption = e.wordSet[e.currentOptions][0]);
          for (var r = 0; r < e.currentActiveLeaves.length; )
            1 == e.currentActiveLeaves[r] &&
              (e.currentActiveLeaves[r] = e.wordSet[e.currentOptions][r]),
              r++;
          l(e.currentActiveLeaves),
            e.generateCreatures(),
            (p = 2),
            (k = 0),
            o(function () {
              e.$broadcast("stopAudio");
              var o;
              (o =
                "challenge" == e.playMode && "es" == e.language
                  ? "escribe"
                  : "find"),
                (u = [o, s(e.correctOption)]),
                e.playCurrentWord(),
                AccessibilityManager.updateTabOrder("playScreen", function () {
                  AccessibilityManager.setFocus($(".leafCover.active")[0]);
                }),
                e.$emit(a.SAVE_TINCAN_DATA);
            }, 0);
        }),
        (e.repeatWordAudioClick = function () {
          e.playCurrentWord();
        }),
        (e.playAslVideo = function () {
          e.myPopup = !1;
          var a = c(e.correctOption);
          e.$broadcast("playVideo", a),
            o(function () {
              AccessibilityManager.setTabGroup("aslScreenInstruction"),
                AccessibilityManager.updateTabOrder(
                  "aslScreenInstruction",
                  function () {
                    AccessibilityManager.setFocus(".popup1 .aslvideopop");
                  }
                );
            }, 200);
        }),
        (e.playAslInstructionVideo = function () {
          var a;
          (e.myPopup = !1),
            "easy" == e.playMode && (a = m("SS_info2")),
            "challenge" == e.playMode && (a = m("SS_info3")),
            e.$broadcast("playVideo", a),
            o(function () {
              AccessibilityManager.setTabGroup("aslScreenInstruction"),
                AccessibilityManager.updateTabOrder(
                  "aslScreenInstruction",
                  function () {
                    AccessibilityManager.setFocus(".popup1 .aslvideopop");
                  }
                );
            }, 200);
        }),
        (e.playAslIntoInstructionVideo = function () {
          var a = m("SS_info1");
          e.$broadcast("playIntroInstructionVideo", a),
            o(function () {
              AccessibilityManager.setTabGroup("aslScreenInstruction"),
                AccessibilityManager.updateTabOrder(
                  "aslScreenInstruction",
                  function () {
                    AccessibilityManager.setFocus(".popup1 .aslvideopop");
                  }
                );
            }, 200);
        }),
        (e.playCurrentWord = function () {
          e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.callbackRef = function () {}),
            (e.audioCallback.arrIndex = u.length - 1),
            e.$broadcast("playAudioArray", u, e.audioCallback);
        }),
        (e.generateCreatures = function () {
          (e.creatures = []),
            angular.forEach(e.currentActiveLeaves, function (a, o) {
              if ("" == a) e.creatures.push(0);
              else {
                var r = Math.floor(3 * Math.random()) + 1;
                e.creatures.push(r);
              }
            });
        }),
        (e.startTimer = function () {
          (e.pauseTimer = !1),
            (e.timer = r(function () {
              e.timeLimit <= 0 &&
                ((e.timeLimit = 0),
                r.cancel(e.timer),
                (g = !0),
                e.refreshAudioCallbackObj(),
                (e.audioCallback.type = "end"),
                (e.audioCallback.callbackRef = function () {
                  (g = !1), e.levelCompleteHandle();
                }),
                o(function () {
                  e.$broadcast("stopAudio"),
                    e.$broadcast("playAudio", "timerend", e.audioCallback);
                }, 100)),
                e.timeLimit < 10
                  ? (e.time = ":0" + e.timeLimit)
                  : (e.time = ":" + e.timeLimit),
                !1 === e.pauseTimer && e.timeLimit--,
                e.timeLimit % 5 == 0 && e.$emit(a.SAVE_TINCAN_DATA);
            }, 1e3));
        }),
        (e.optionClick = function (r, i) {
          if (
            !r ||
            !angular.element(r.currentTarget).hasClass("selectedLeaf")
          ) {
            var n = s(e.correctOption);
            e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].responses[e.currentOptions].target = e.correctOption;
            var t = "";
            if (void 0 != r) {
              if (1 == g) {
                if (1 == e.allowOptionClick) {
                  e.$broadcast("stopAudio"),
                    (e.allowOptionClick = !1),
                    (g = !1);
                  var l = r,
                    c = i,
                    m = e.audioCallback;
                  m &&
                    m.callbackRef &&
                    "end" == m.type &&
                    (m.delay >= 0
                      ? o(function () {
                          m.callbackRef.apply(m.thisRef, m.params),
                            e.optionClick(l, c);
                        }, 0)
                      : (m.callbackRef.apply(m.thisRef, m.params),
                        e.optionClick(l, c)));
                }
                return;
              }
              if (angular.element(r.currentTarget).hasClass("disabledOption"))
                return;
              var d = r.currentTarget;
              $(d).addClass("selectedLeaf"), (t = e.currentActiveLeaves[i]);
            } else
              void 0 != e.droppedLetter &&
                ((t = e.droppedLetter.toLowerCase()),
                ("3" != L ||
                  (12 != e.levelLaunched && 10 != e.levelLaunched)) &&
                  e.droppedLetter.toLowerCase() ==
                    e.puzzleWord.join("").toLowerCase() &&
                  (e.level2Flag = !0),
                "3" != L ||
                  (12 != e.levelLaunched && 10 != e.levelLaunched) ||
                  e.droppedLetter != e.puzzleWord.join("") ||
                  (e.level2Flag = !0));
            e.$broadcast("stopAudio"),
              2 == p
                ? (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                    e.playMode
                  ].responses[e.currentOptions].attempt1 = t)
                : 1 == p &&
                  (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                    e.playMode
                  ].responses[e.currentOptions].attempt2 = t),
              e.currentActiveLeaves[i] == e.correctOption || e.level2Flag
                ? (angular
                    .element(".wordContainer .leafCover")
                    .addClass("disableOptions"),
                  (e.level2Flag = !1),
                  f.push(e.correctOption),
                  (e.progress = e.progress + 100 / e.wordSet.length),
                  2 == p && e.levelScore++,
                  (e.correctOptionsArr[e.currentOptions].word =
                    e.correctOption),
                  (e.correctOptionsArr[e.currentOptions].attempts = p),
                  e.refreshAudioCallbackObj(),
                  (g = !0),
                  (e.audioCallback.type = "end"),
                  (e.audioCallback.callbackRef = function () {
                    $(d).find(".leafCover").addClass("bubbleBustAnim"),
                      o(function () {
                        (g = !1), e.loadNextQuestion();
                      }, 800);
                  }),
                  e.$broadcast("playAudio", "correct", e.audioCallback))
                : (p > 1
                    ? (e.allowOptionClick = !0)
                    : angular
                        .element(".wordContainer .leafCover")
                        .addClass("disableOptions"),
                  e.refreshAudioCallbackObj(),
                  (e.audioCallback.arrIndex = 1),
                  (e.audioCallback.type = "end"),
                  2 == p
                    ? (o(function () {
                        $(d).hide(),
                          AccessibilityManager.setFocus(".leafCover.active");
                      }, 500),
                      e.$broadcast(
                        "playAudioArray",
                        ["incorrect", n],
                        e.audioCallback
                      ),
                      (e.correctOptionsArr[e.currentOptions].attempts = p))
                    : (o(function () {
                        for (
                          var a = angular
                              .element(".wordContainer .active")
                              .children("span"),
                            o = 0;
                          o < a.length;
                          o++
                        )
                          a[o].innerHTML !== e.correctOption &&
                            angular.element(a[o].parentNode).hide();
                        $(d).hide(),
                          AccessibilityManager.setFocus(".leafCover.active");
                      }, 500),
                      e.$broadcast(
                        "playAudioArray",
                        ["incorrect2", n],
                        e.audioCallback
                      ),
                      (e.correctOptionsArr[e.currentOptions].attempts = p)),
                  (g = !0),
                  p--,
                  (e.audioCallback.callbackRef = function () {
                    (e.allowOptionClick = !1),
                      (g = !1),
                      angular
                        .element(".wordContainer .leafCover")
                        .removeClass("disableOptions"),
                      (e.userAttempts = 0),
                      0 == p &&
                        ((e.correctOptionsArr[e.currentOptions].word =
                          e.correctOption),
                        (e.correctOptionsArr[e.currentOptions].attempts = p),
                        v.push(e.correctOption),
                        e.loadNextQuestion());
                  })),
              e.$emit(a.SAVE_TINCAN_DATA);
          }
        }),
        (e.inactiveCorrectLetterPlacement = function () {
          var a = e.puzzleWord;
          if ("3" != L || (12 != e.levelLaunched && 10 != e.levelLaunched))
            var o = e.droppedLetter.toLowerCase().split("");
          else var o = e.droppedLetter.split("");
          e.highlightPos = [];
          for (var r = 0, i = 0; i < e.puzzleWord.length; i++)
            if (
              (("3" != L || (12 != e.levelLaunched && 10 != e.levelLaunched)) &&
                (a[i] = a[i].toLocaleLowerCase()),
              a[i] == o[i])
            ) {
              $($(".wordDrops")[i]).addClass("disableDiv"), (r += 1);
              $($(".wordDrops")[i]).prepend(
                '<span class="correctTickLevel2"><?xml version="1.0" encoding="UTF-8"?><svg width="46px" height="40px" viewBox="0 0 40 40" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\x3c!-- Generator: Sketch 49.2 (51160) - http://www.bohemiancoding.com/sketch --\x3e<title>check</title><desc>Created with Sketch.</desc><defs><path d="M16.469,33.863 C16.024,34.308 15.502,34.531 14.905,34.531 C14.307,34.531 13.785,34.308 13.34,33.863 L1.668,22.191 C1.223,21.746 1,21.224 1,20.627 C1,20.029 1.223,19.508 1.668,19.062 L4.656,16.074 C5.078,15.652 5.594,15.441 6.203,15.441 C6.813,15.441 7.328,15.652 7.75,16.074 L14.922,23.246 L32.5,5.633 C32.946,5.211 33.467,5 34.065,5 C34.662,5 35.172,5.211 35.594,5.633 L38.582,8.621 C39.028,9.066 39.25,9.588 39.25,10.185 C39.25,10.783 39.028,11.304 38.582,11.75 L16.469,33.863 Z" id="path-1"></path></defs><g id="check" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Fill-1"><use fill="#008A00" fill-rule="evenodd" xlink:href="#path-1"></use>                                           <path stroke="#FFFFFF" stroke-width="2" d="M14.921308,21.8310945 L31.8127072,4.90661949 C32.4431615,4.31009099 33.2095712,4 34.065,4 C34.927254,4 35.6915967,4.31638317 36.3011068,4.92589322 L39.2883127,7.91310005 C39.9192275,8.54260022 40.25,9.3178715 40.25,10.185 C40.25,11.0524505 39.919775,11.8264386 39.2891068,12.4571068 L17.1761068,34.5701068 C16.5462543,35.1999593 15.7712251,35.531 14.905,35.531 C14.0379655,35.531 13.2628805,35.2000941 12.6328932,34.5701068 L0.960893219,22.8981068 C0.331040748,22.2682543 0,21.4932251 0,20.627 C0,19.760452 0.330490046,18.9867121 0.960893219,18.3548932 L3.94889322,15.3668932 C4.55946405,14.7563224 5.3302106,14.441 6.203,14.441 C7.07647424,14.441 7.84632028,14.7561067 8.45710678,15.3668932 L14.921308,21.8310945 Z"></path></g></g></svg></span>'
              );
            } else
              $($(".wordDrops")[i]).addClass("transparentDiv"),
                p > 1 &&
                  0 == e.highlightPos.length &&
                  (e.highlightPos.push(i), (e.currentDropIdx = i));
          if ((2 == k && $(".correctTickLevel2").css("opacity", "1"), 2 == k)) {
            for (var n = 0; n < e.puzzleWord.length; n++)
              if ($($(".wordDrops")[n]).hasClass("transparentDiv")) {
                $($(".wordDrops")[n]).empty(),
                  "'" == a[n] && (a[n] = "SingleQuote"),
                  "," == a[n] && (a[n] = "Comma"),
                  "." == a[n] && (a[n] = "FullStop");
                var t = $($(".key_" + a[n]).clone())[0];
                void 0 == t &&
                  (e.isLowerCase
                    ? (a[n] = a[n].toLowerCase())
                    : (a[n] = a[n].toUpperCase()),
                  (t = $($(".key_" + a[n]).clone())[0]),
                  "3" != L ||
                    (12 != e.levelLaunched && 10 != e.levelLaunched) ||
                    (e.isLowerCase
                      ? (t.innerText = t.innerText.toUpperCase())
                      : (t.innerText = t.innerText.toLowerCase()))),
                  $($(".wordDrops")[n]).prepend(t);
              }
            e.autoFillDropZones = !0;
          }
        }),
        (e.deleteLetter = function () {
          if (
            ((dropId = "#letter_" + e.currentDropIdx),
            $(dropId).hasClass("disableDiv"))
          )
            return void (e.currentDropIdx = Math.max(0, e.currentDropIdx - 1));
          $(dropId).empty(),
            $(dropId).removeClass("letterDroppedIn transparentDiv"),
            (e.showCheckAnswerBtn = !1),
            e.highlightPos.indexOf(e.currentDropIdx) >= 0 &&
              e.highlightPos.splice(
                e.highlightPos.indexOf(e.currentDropIdx),
                1
              ),
            (e.currentDropIdx = Math.max(0, e.currentDropIdx - 1));
        }),
        (e.letterClick = function (a) {
          var o = $(a.currentTarget)[0].classList,
            r = "";
          if ($(a.currentTarget).hasClass("backspace")) e.deleteLetter();
          else {
            for (var i = 0; i < o.length - 1; i++)
              if (-1 !== o[i].indexOf("key_")) {
                var n = o[i].split("_");
                r = n[n.length - 1];
              }
            e.showLetterInDropBox("", "", r);
          }
        }),
        (e.droppableClickHandler = function (a) {
          e.currentDropIdx = a;
        }),
        e.$on("ItemDropped", function (a, o) {
          e.showLetterInDropBox(a, o);
        }),
        (e.showLetterInDropBox = function (a, r, i) {
          if (!e.disableDrop) {
            var n,
              t,
              l = 0;
            (e.userAttempts = -1),
              r
                ? ((n = $(r.ui.draggable).clone()),
                  (e.currentDroppedID = r.event.target.id.split("_")),
                  (e.currentDropIdx = parseInt(
                    e.currentDroppedID[e.currentDroppedID.length - 1]
                  )))
                : ((n = $(".key_" + i).clone()),
                  e.isLowerCase ||
                    0 != n.length ||
                    ((i = i.toUpperCase()), (n = $(".key_" + i).clone())),
                  e.isLowerCase &&
                    0 == n.length &&
                    ((i = i.toLowerCase()), (n = $(".key_" + i).clone()))),
              (t = "#letter_" + e.currentDropIdx),
              n.addClass("droppedItem"),
              $(t).hasClass("disableDiv") ||
                ((e.disableDrop = !0),
                $(n[0]).hasClass("backspace")
                  ? e.deleteLetter()
                  : e.autoFillDropZones ||
                    ($(t).empty(),
                    $(t).prepend($(n)[0]),
                    $(t)
                      .removeClass("transparentDiv")
                      .addClass("letterDroppedIn")),
                o(function () {
                  for (var a = 0; a < e.puzzleWord.length; a++)
                    0 == $(".wordDrops")[a].children.length ||
                      $("#letter_" + a).hasClass("transparentDiv") ||
                      l++,
                      l >= e.puzzleWord.length && (e.showCheckAnswerBtn = !0);
                  e.highlightPos.indexOf(e.currentDropIdx) < 0 &&
                    e.highlightPos.push(e.currentDropIdx);
                  var a = 0;
                  for (a = e.currentDropIdx + 1; a < e.puzzleWord.length; a++)
                    if (
                      e.highlightPos.indexOf(a) < 0 &&
                      !$("#letter_" + a).hasClass("disableDiv")
                    ) {
                      e.currentDropIdx = a;
                      break;
                    }
                  if (a >= e.puzzleWord.length)
                    for (var r = 0; r < e.currentDropIdx; r++)
                      if (
                        e.highlightPos.indexOf(r) < 0 &&
                        !$("#letter_" + a).hasClass("disableDiv")
                      ) {
                        e.currentDropIdx = r;
                        break;
                      }
                  o(function () {
                    e.disableDrop = !1;
                  }, 200);
                }, 200));
          }
        }),
        (e.checkAnswerClick = function () {
          if (((e.isReload = !1), (e.userAttempts = p), 1 != g)) {
            k++,
              (e.showCheckAnswerBtn = !1),
              AccessibilityManager.setFocus(".feedbackTable .tableData"),
              (e.droppedLetter = "");
            for (var a = 0; a < e.puzzleWord.length; a++) {
              var o = $($(".wordDrops")[a])
                .find(".droppedItem span")
                .text()
                .split("")[0];
              (o && "" != o && " " != o) ||
                ($($(".wordDrops")[a])
                  .find(".droppedItem")
                  .hasClass("key_SingleQuote") && (o = "'"),
                $($(".wordDrops")[a])
                  .find(".droppedItem")
                  .hasClass("key_Comma") && (o = ","),
                $($(".wordDrops")[a])
                  .find(".droppedItem")
                  .hasClass("key_FullStop") && (o = ".")),
                (e.droppedLetter = e.droppedLetter + o);
            }
            e.optionClick(), e.inactiveCorrectLetterPlacement();
          }
        }),
        (e.backBtnClick = function () {
          !0 !== g &&
            (e.$broadcast("stopAudio"),
            e.$broadcast("togglepopup", "back_" + e.language),
            (e.pauseTimer = !0),
            AccessibilityManager.disableElements([".playScreen"]));
        }),
        e.$on("popupConfirm", function (a, i) {
          "back" == i &&
            ((e.pauseTimer = !1),
            r.cancel(e.timer),
            AccessibilityManager.enableElements([".playScreen"]),
            e.showLevelScreen()),
            "end" == i &&
              (AccessibilityManager.panelCloseHandler(),
              (g = !0),
              e.refreshAudioCallbackObj(),
              (e.audioCallback.type = "end"),
              (e.audioCallback.callbackRef = function () {
                (g = !1), e.gotoLevelScreen();
              }),
              e.$broadcast("playAudio", "click", e.audioCallback)),
            "reload" == i &&
              ((e.showFishAnimation = !1),
              e.$$phase || e.$apply(),
              e.$broadcast("stopAudio"),
              (e.showEndPopup = !1),
              (e.screenType = 1),
              e.gotoLevelScreen(),
              e.$emit("SUBMIT_TINCAN_DATA"),
              o(function () {
                AccessibilityManager.setTabGroup("splashScreen"),
                  AccessibilityManager.updateTabOrder(
                    "splashScreen",
                    function () {
                      AccessibilityManager.setFocus("playBtn");
                    }
                  );
              }, 400));
        }),
        e.$on("popupClosed", function (a, r) {
          "back" == r &&
            AccessibilityManager.enableElements([".playScreen"], function () {
              AccessibilityManager.updateTabOrder("playScreen", function () {
                AccessibilityManager.setFocus($(".leafCover.active")[0]),
                  (e.pauseTimer = !1);
              });
            }),
            "reload" == r &&
              (AccessibilityManager.panelCloseHandler(),
              AccessibilityManager.updateTabOrder("levelScreen", function () {
                AccessibilityManager.setFocus(
                  ".levelScreenNav .levelInstructionBtn"
                );
              }),
              1 == e.showEndPopup &&
                o(function () {
                  AccessibilityManager.setTabGroup("rewardPopup"),
                    AccessibilityManager.updateTabOrder(
                      "rewardPopup",
                      function () {
                        AccessibilityManager.setFocus(
                          ".levelEndPopup .endHeading"
                        );
                      }
                    );
                }, 400));
        }),
        (e.audioBtnClick = function () {
          !0 !== g && (e.$broadcast("stopAudio"), e.playCurrentWord());
        }),
        (e.levelCompleteHandle = function () {
          r.cancel(e.timer), e.updateScore(), (e.levelEndTime = new Date());
          var i = e.languageTxt.feedbacks[e.currentLvlPoints];
          angular.element(".popupContainer").scope().cancelTxt = i;
          var n = [],
            t = e.levelScore.toString(),
            l = e.wordSet.length;
          (e.puzzleWord = ""),
            (l = l.toString()),
            e.percentComplete >= e.unlockThresh
              ? ((e.showFishAnimation = !0),
                angular.element(".endLevelFishes").css("display", "block"),
                (n =
                  "Isla 25" ==
                    e.levelGroups[e.currentLevelGroup][e.currentLevel].name ||
                  "Island 25" ==
                    e.levelGroups[e.currentLevelGroup][e.currentLevel].name
                    ? ["r6", t, "r2", l, "r3"]
                    : "es" == e.language && "challenge" == e.playMode
                    ? ["level2PopupCorrect", t, "r2", l, "r3"]
                    : ["r1", t, "r2", l, "r3"]))
              : (n = ["r4", t, "r2", l, "r5"]),
            e.$$phase || e.$apply(),
            e.$broadcast("stopAudio"),
            (e.showEndPopup = !0),
            e.refreshAudioCallbackObj(),
            (e.audioCallback.type = "end"),
            (e.audioCallback.arrIndex = n.length - 1),
            (e.audioCallback.callbackRef = function () {}),
            (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].date =
              e.getDateString(e.gameStartTime) +
              " " +
              e.getTimeString(e.levelEndTime)),
            (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].timeSpent = e.millisToMinutesAndSeconds(
              new Date(e.levelEndTime) - new Date(e.gameStartTime)
            )),
            o(function () {
              e.$broadcast("playAudioArray", n, e.audioCallback);
            }, 500),
            o(function () {
              AccessibilityManager.setTabGroup("rewardPopup"),
                AccessibilityManager.updateTabOrder("rewardPopup", function () {
                  AccessibilityManager.setFocus(".levelEndPopup .endHeading");
                });
            }, 400),
            e.$emit(a.SAVE_TINCAN_DATA);
        }),
        (e.updateScore = function () {
          var a =
            e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[e.playMode]
              .score;
          e.percentComplete = (100 * e.levelScore) / e.wordSet.length;
          var o = e.levelScore;
          e.percentComplete >= 70
            ? (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].isPass = e.languageTxt.yesTxt)
            : (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].isPass = e.languageTxt.noTxt),
            o > a &&
              ((e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score = o),
              (e.userScore = e.userScore + (o - a)),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].wordset = b),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].incorrectWords = v),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].correctWords = f)),
            (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
              e.playMode
            ].percentComplete = e.percentComplete + "%");
        }),
        (e.gotoLevelScreen = function () {
          (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
            e.playMode
          ].attempt = !0),
            e.percentComplete >= e.unlockThresh &&
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].complete = !0),
            "easy" != e.playMode ||
              e.levelGroups[e.currentLevelGroup][e.currentLevel].modes.challenge
                .active ||
              (e.percentComplete >= e.unlockThresh &&
                (e.levelGroups[e.currentLevelGroup][
                  e.currentLevel
                ].modes.challenge.active = !0)),
            "challenge" == e.playMode &&
              (e.currentLevel < e.levelGroups[e.currentLevelGroup].length - 1 &&
              !e.levelGroups[e.currentLevelGroup][e.currentLevel + 1].modes.easy
                .active
                ? e.percentComplete >= e.unlockThresh &&
                  ((e.levelGroups[e.currentLevelGroup][
                    e.currentLevel + 1
                  ].modes.easy.active = !0),
                  e.zoomedLevel++)
                : e.currentLevel >=
                    e.levelGroups[e.currentLevelGroup].length - 1 &&
                  e.currentLevelGroup < e.totalGroups &&
                  !e.levelGroups[e.currentLevelGroup + 1][0].modes.easy
                    .active &&
                  e.percentComplete >= e.unlockThresh &&
                  (e.levelGroups[e.currentLevelGroup + 1][0].modes.easy.active =
                    !0)),
            (g = !1),
            o(function () {
              e.$emit(a.SAVE_TINCAN_DATA);
            }, 500);
        }),
        (e.levelPageNav = function (a, o) {
          if (!angular.element(a.currentTarget).hasClass("disable")) {
            switch (o) {
              case 1:
                e.currentLevelGroup = e.currentLevelGroup - 1;
                break;
              case 2:
                e.currentLevelGroup = e.currentLevelGroup + 1;
            }
            AccessibilityManager.updateTabOrder("levelScreen", function () {
              AccessibilityManager.setFocus($(".levelMode")[0]);
            });
          }
        }),
        e.$on("audioStarted", function (a, r, i) {
          (y = r),
            (C = "find" == r || "correctans" == r ? e.correctOption : ""),
            (e.isAudioPlaying = !0),
            e.ccOn && e.$broadcast("showCaption", r, C),
            i &&
              i.callbackRef &&
              "start" == i.type &&
              (i.delay >= 0
                ? o(function () {
                    i.callbackRef.apply(i.thisRef, i.params);
                  }, i.delay)
                : i.callbackRef.apply(i.thisRef, i.params));
        }),
        e.$on("audioEnd", function (a, r, i) {
          (y = ""), (C = ""), (e.isAudioPlaying = !1);
          var n = 0;
          switch (r) {
            case "find":
            case "correctans":
            case "correct":
            case "incorrect":
              n = 500;
          }
          e.$broadcast("hideCaption", r, n),
            i &&
              i.callbackRef &&
              "end" == i.type &&
              (i.delay >= 0
                ? o(function () {
                    i.callbackRef.apply(i.thisRef, i.params);
                  }, i.delay)
                : i.callbackRef.apply(i.thisRef, i.params));
        }),
        (e.ccBtnClick = function () {
          (e.ccOn = !e.ccOn),
            e.ccOn
              ? e.$broadcast("showCaption", y, C)
              : e.$broadcast("hideCaption", y);
        }),
        (e.hoverLeafHandler = function (e, a) {}),
        (e.gameParentClick = function (a) {
          $(a.target).hasClass("gameInfoContainer") ||
            $(a.target).hasClass("infoAudio") ||
            $(a.target).hasClass("infoTxt") ||
            $(a.target).hasClass("gameInfoBtn") ||
            (1 == e.showLevelInfo && e.closeLevelInfo());
        }),
        e.$on("saveViewTincanData", function () {
          TincanManager.updateTincanData(
            e.$parent.appData.data.tincan,
            "total_score",
            j
          ),
            TincanManager.updateTincanData(
              e.$parent.appData.data.tincan,
              "restoreGame",
              !0
            ),
            e.saveGameState();
        }),
        (e.reportHeadClick = function (a) {
          1 == a && (e.showOverall = !0),
            2 == a &&
              ((e.showOverall = !1),
              setTimeout(function () {
                $($(".reportHeading")[1]).focus();
              }, 300));
        }),
        (e.generateReport = function () {
          e.$emit(a.SAVE_TINCAN_DATA),
            void 0 != e.$parent.appData.data.tincan.userDetails &&
              (e.userName = e.$parent.appData.data.tincan.userDetails.userId);
          var o = [],
            r = [];
          (e.reportLevels = []),
            (e.currentReportLevel = 0),
            (e.showOverall = !0),
            (e.reportTableHeading = [
              e.languageTxt.island.toUpperCase(),
              e.languageTxt.levelTxt.toUpperCase(),
              e.languageTxt.timeSpentTxt.toUpperCase(),
              e.languageTxt.percentCorrectTxt.toUpperCase(),
              e.languageTxt.targetWordTxt.toUpperCase(),
              e.languageTxt.ans1.toUpperCase(),
              e.languageTxt.ans2.toUpperCase(),
            ]),
            angular
              .element(".splashScreen .splashReportBtn")
              .addClass("disableReportBtn"),
            angular.forEach(e.levelGroups, function (a) {
              angular.forEach(a, function (a) {
                var i = null;
                angular.forEach(a.modes, function (e, n) {
                  e.active &&
                    (!i &&
                      e.wordset &&
                      e.wordset.length > 0 &&
                      (i = {
                        number: a.level,
                        words: e.wordset,
                        correct: [],
                        levelRef: a,
                      }),
                    angular.forEach(e.wordset, function (a) {
                      o.indexOf(a) < 0 && o.push(a),
                        e.correctWords &&
                          e.correctWords.indexOf(a) >= 0 &&
                          (r.indexOf(a) < 0 && r.push(a),
                          i.correct.indexOf(a) < 0 && i.correct.push(a));
                    }));
                }),
                  i && e.reportLevels.push(i);
              });
            });
          var i = e.$parent.appData.data.tincan.time_in_units;
          (e.totalTime = TincanManager.getTimeInWords(i)),
            (e.totalWordsAttempted = o.length),
            (e.correctWordsAnswered = r.length),
            void 0 == e.reportLevels ||
            null == e.reportLevels ||
            0 == e.reportLevels.length
              ? (e.blankReport = !0)
              : e.reportLevels[0].levelRef.modes.easy.score > 0 ||
                e.reportLevels[0].levelRef.modes.challenge.score > 0
              ? (e.showReport = !0)
              : (e.blankReport = !0),
            AccessibilityManager.setTabGroup("teacherReport"),
            AccessibilityManager.updateTabOrder("teacherReport", function () {
              AccessibilityManager.setFocus(".gameReportContainer .gameReport");
            });
        }),
        (e.downloadReport = function (a) {
          var o = e.reportLevels,
            r = "",
            i = e.languageTxt.spellingSeaTxt,
            n = e.languageTxt.passingTxt + e.unlockThresh + "%";
          if (void 0 != e.$parent.appData.data.tincan.userDetails)
            var t = e.$parent.appData.data.tincan.userDetails.userId;
          r += i + "\r\n" + n + "\r\n" + t + "\r\n\n";
          for (
            var l = [
                e.languageTxt.island,
                e.languageTxt.levelTxt,
                e.languageTxt.dateNtimeTxt,
                e.languageTxt.comNpassTxt,
                e.languageTxt.timeSpentLvl,
                e.languageTxt.perCompTxt,
                e.languageTxt.patternNrule,
                e.languageTxt.targetWordTxt,
                e.languageTxt.studentAns1,
                e.languageTxt.studentAns2,
              ],
              s = "",
              c = 0;
            c < l.length;
            ++c
          )
            s += l[c] + ",";
          (s = s.slice(0, -1)), (r += s + "\r\n");
          for (var m = 0; m < o.length; m++)
            for (
              var d = o[m].levelRef, p = Object.keys(d.modes), u = 0;
              u < p.length;
              ++u
            ) {
              var g = d.modes[p[u]];
              0 == u && (e.numOfWordsInLevel = g.responses.length);
              for (var b = 0; b < g.responses.length; ++b) {
                var s = "";
                if (0 == b) {
                  var f = d.rule;
                  (f = f.replace(/,/g, "")),
                    (s =
                      s +
                      d.name +
                      "," +
                      g.modeName +
                      "," +
                      g.date +
                      "," +
                      g.isPass +
                      "," +
                      g.timeSpent +
                      "," +
                      g.percentComplete +
                      "," +
                      f +
                      ", , , ,"),
                    (s =
                      s +
                      "\r\n" +
                      d.name +
                      "," +
                      g.modeName +
                      ", , , , , ," +
                      g.responses[b].target +
                      "," +
                      g.responses[b].attempt1 +
                      "," +
                      g.responses[b].attempt2 +
                      ",");
                } else
                  s =
                    s +
                    d.name +
                    "," +
                    g.modeName +
                    ", , , , , ," +
                    g.responses[b].target +
                    "," +
                    g.responses[b].attempt1 +
                    "," +
                    g.responses[b].attempt2 +
                    ",";
                g.correctWords &&
                g.correctWords.indexOf(g.responses[b].target) >= 0
                  ? (s += "Correct")
                  : (s += "Incorrect"),
                  s.slice(0, s.length - 1),
                  (r += s + "\r\n"),
                  b == g.responses.length - 1 &&
                    ((s = " , , , , , , , , , , ,"), (r += s + "\r\n"));
              }
            }
          if ("" == r) return void alert("Invalid data");
          var v = "MyReport_";
          (v += i.replace(/ /g, "_")), (v += ".xlsx"), e.createXLS(r, v);
        }),
        (e.createXLS = function (e, a) {
          var o = e.split("\n"),
            r = $JExcel.new("Calibri 10 #000000");
          r.set({ sheet: 0, value: "Report" }), r.addSheet("Sheet 2");
          for (
            var i = r.addStyle({
                font: "Calibri 14 #000000 B",
                align: "C C",
                fill: "#F0F0F0",
              }),
              n = r.addStyle({
                font: "Calibri 14 #000000 B",
                align: "C C",
                fill: "#F0F0F0",
              }),
              t = r.addStyle({
                font: "Calibri 14 #000000 B",
                align: "C C",
                fill: "#F0F0F0",
              }),
              l = o[4].split(","),
              s = r.addStyle({
                border: "thin,thin,thin,thin #333333",
                font: "Calibri 12 #000 B",
                fill: "#F0F0F0",
                align: "L L",
              }),
              c = 0;
            c < l.length;
            c++
          )
            r.set(0, c, 3, l[c].trim(), s),
              r.set(0, c, void 0, "auto"),
              c < l.length - 2
                ? r.set(0, c, void 0, 22)
                : r.set(0, c, void 0, 37),
              r.set(0, c, 0, "", i),
              r.set(0, c, 1, "", n),
              r.set(0, c, 2, "", t);
          r.set(0, 0, 0, o[0].trim(), i),
            r.set(0, 0, 1, o[1].trim(), n),
            r.set(0, 0, 2, o[2].trim(), t);
          var m =
              (r.addStyle({ border: "thin,none,none,none #333333" }),
              r.addStyle({ border: "none,thin,none,none #333333" }),
              r.addStyle({
                border: "none,none,thin,none #333333",
                fill: "#F0F0F0",
              }),
              r.addStyle({
                border: "none,none,none,thin #333333",
                fill: "#F0F0F0",
              }),
              r.addStyle({
                border: "thin,thin,thin,thin #333333",
                align: "L L",
              })),
            d = r.addStyle({
              border: "thin,thin,thin,thin #333333",
              fill: "#FAFAD2",
              align: "L L",
            }),
            p = r.addStyle({
              border: "thin,thin,thin,thin #333333",
              fill: "#B3F39E",
              align: "L L",
            }),
            u = r.addStyle({
              border: "thin,thin,thin,thin #333333",
              fill: "#F79898",
              align: "L L",
            }),
            g = r.addStyle({
              border: "thin,thin,thin,thin #ffffff",
              fill: "#3d3d3d",
              font: "Calibri 10 #ffffff B",
              align: "L L",
            }),
            b = r.addStyle({ fill: "#a09898" });
          if ("3" == L) var f = 12;
          else var f = 22;
          for (var c = 5; c < o.length; c++) {
            var v = o[c].split(","),
              h = !1,
              j = !1,
              z = c - 5 + 1;
            if (
              ((z - 1) % f == 0 && (h = !0),
              z % f == 0 && (j = !0),
              v.length >= l.length)
            )
              for (var y = 0; y < l.length; y++)
                r.set(0, y, c - 1, v[y].trim(), m),
                  v[y] &&
                    y >= l.length - 2 &&
                    (v[y].trim().toLowerCase() ==
                      v[l.length - 3].trim().toLowerCase() &&
                    " " != v[l.length - 3].trim().toLowerCase()
                      ? r.set(0, y, c - 1, v[y].trim(), p)
                      : "-" !== v[y].trim().toLowerCase() &&
                        r.set(0, y, c - 1, v[y].trim(), u)),
                  v[y] &&
                    y == l.length - 3 &&
                    (v[y].trim().toLowerCase() ==
                      v[l.length - 2].trim().toLowerCase() &&
                    " " != v[l.length - 2].trim().toLowerCase()
                      ? r.set(0, y, c - 1, v[y].trim(), p)
                      : v[y].trim().toLowerCase() ==
                        v[l.length - 1].trim().toLowerCase()
                      ? r.set(0, y, c - 1, v[y].trim(), d)
                      : r.set(0, y, c - 1, v[y].trim(), u)),
                  1 == h && r.set(0, y, c - 1, v[y].trim(), g),
                  1 == j && r.set(0, y, c - 1, v[y].trim(), b);
          }
          r.generate(a);
        }),
        AccessibilityManager.registerActionHandler(
          "closeReport",
          "",
          "",
          function () {
            e.closeReport();
          }
        ),
        (e.closeReport = function () {
          (e.showReport = !1),
            angular
              .element(".splashScreen .splashReportBtn")
              .removeClass("disableReportBtn"),
            AccessibilityManager.setFocus(".splashScreen .splashReportBtn");
        }),
        (e.closeBlankReport = function () {
          (e.blankReport = !1),
            angular
              .element(".splashScreen .splashReportBtn")
              .removeClass("disableReportBtn"),
            AccessibilityManager.setFocus(".splashScreen .splashReportBtn");
        }),
        (e.changeReportLevel = function (a, o) {
          switch (o) {
            case 1:
              e.currentReportLevel =
                e.currentReportLevel + 1 < e.reportLevels.length
                  ? e.currentReportLevel + 1
                  : e.currentReportLevel;
              break;
            case 0:
              e.currentReportLevel =
                e.currentReportLevel - 1 >= 0 ? e.currentReportLevel - 1 : 0;
          }
        }),
        (e.toggleLevelInfo = function () {
          ("levelinfo" != y && 1 == g) ||
            (e.showLevelInfo ? e.closeLevelInfo() : (e.showLevelInfo = !0));
        }),
        (e.levelInfoAudio = function () {
          ("levelinfo" != y && 1 == g) ||
            ((e.levelInfoAudioActive = !e.levelInfoAudioActive),
            e.levelInfoAudioActive
              ? (e.refreshAudioCallbackObj(),
                (e.audioCallback.type = "end"),
                (g = !0),
                (e.audioCallback.callbackRef = function () {
                  (e.levelInfoAudioActive = !1), (g = !1);
                }),
                e.$broadcast("playAudio", "levelinfo", e.audioCallback))
              : (e.$broadcast("stopAudio"), (g = !1)));
        }),
        AccessibilityManager.registerActionHandler(
          "closeLevelInfo",
          "",
          "",
          function () {
            e.closeLevelInfo();
          }
        ),
        (e.closeLevelInfo = function () {
          (e.showLevelInfo = !1),
            (e.levelInfoAudioActive = !1),
            "levelinfo" == y && e.$broadcast("stopAudio"),
            (g = !1);
        }),
        (e.saveandexit = function () {
          (e.currentOptions = -1),
            e.$broadcast("togglepopup", "reload_" + e.language),
            o(function () {
              AccessibilityManager.setTabGroup("saveAndExitPopup"),
                AccessibilityManager.updateTabOrder(
                  "saveAndExitPopup",
                  function () {
                    AccessibilityManager.setFocus(
                      ".popupContainer .textContainer .innerText"
                    );
                  }
                );
            }, 400);
        }),
        (e.endLevelHandler = function () {
          if (
            ((e.currentOptions = -1),
            (e.showFishAnimation = !1),
            angular.element(".endLevelFishes").css("display", "none"),
            e.$$phase || e.$apply(),
            e.$broadcast("stopAudio"),
            (e.showEndPopup = !1),
            e.gotoLevelScreen(),
            e.percentComplete >= e.unlockThresh)
          )
            "easy" == e.playMode
              ? e.levelClick(
                  "",
                  e.levelLaunched,
                  "challenge",
                  "",
                  e.currentLevel
                )
              : "challenge" == e.playMode &&
                e.levelLaunched < e.totalLevels &&
                (e.currentLevel < e.levelGroups[e.currentLevelGroup].length - 1
                  ? ((e.currentLevel = e.currentLevel + 1),
                    e.levelClick(
                      "",
                      parseInt(e.levelLaunched) + 1,
                      "easy",
                      "",
                      e.currentLevel
                    ))
                  : e.currentLevel >=
                      e.levelGroups[e.currentLevelGroup].length - 1 &&
                    e.currentLevelGroup < e.totalGroups &&
                    ((e.currentLevelGroup = e.currentLevelGroup + 1),
                    (e.currentLevel = 0),
                    e.levelClick(
                      "",
                      parseInt(e.levelLaunched) + 1,
                      "easy",
                      "",
                      e.currentLevel
                    )));
          else {
            (e.userScore = e.userScore - e.levelScore),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].score = 0),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].percentComplete = "0%"),
              (e.levelGroups[e.currentLevelGroup][e.currentLevel].modes[
                e.playMode
              ].timeSpent = "");
            var a = 0;
            switch (e.playMode) {
              case "easy":
                a = 1;
                break;
              case "medium":
                a = 2;
                break;
              case "challenge":
                a = 3;
            }
            (j = j - a),
              e.levelClick("", e.levelLaunched, e.playMode, "", e.currentLevel);
          }
        }),
        (e.gotoIslands = function () {
          (e.currentOptions = -1),
            (e.showFishAnimation = !1),
            angular.element(".endLevelFishes").css("display", "none"),
            1 != g &&
              (e.$broadcast("stopAudio"),
              (e.showInstructionsAfterAnim = !0),
              (e.showEndPopup = !1),
              e.gotoLevelScreen(),
              o(function () {
                (A = !0), e.allViewClick(e.currentLevelGroup);
              }, 0));
        }),
        (e.refreshAudioCallbackObj = function () {
          e.audioCallback = {
            thisRef: e,
            params: [],
            type: "end",
            delay: -1,
            arrIndex: -1,
            callbackRef: null,
          };
        }),
        (e.processRawDB = function () {
          function a(e) {
            for (var a = i.slice(), o = "", r = 0; r <= 1; ) {
              var n = Math.floor(Math.random() * a.length),
                t = a.splice(n, 1);
              e.indexOf(t[0]) < 0 && ((o = t[0]), r++);
            }
            return o;
          }
          var o,
            r = e.$parent.appData.data.rawDB[e.language][0][L];
          if (((e.ruleSet = []), !r))
            return (
              console.log("DB file not not found. Game will use backup DB"),
              void (e.$parent.appData.data.dataset =
                e.$parent.appData.data.dataset_bk)
            );
          var i = [],
            n = [];
          angular.forEach(r, function (e) {
            var a = e.Words.split(", "),
              o = e.rule;
            (o = o.replace(/,/g, "")), i.push(a[0]), n.push(o);
          }),
            "3" == L && (o = 10),
            "4" == L && (o = 20),
            "5" == L && (o = 20);
          var t = Math.floor(i.length / 25),
            l = o - t,
            s = i.length - 25 * t,
            c = i.slice(-s);
          l <= 0 && ((l = 0), (c = []), (s = 0));
          var m = {};
          m[e.$parent.appData.language] = {};
          for (var d = 1; d <= 25; ++d) {
            m[e.$parent.appData.language][d] = [];
            for (var p = [], u = [], g = 1; g <= o; ++g) {
              var b = [],
                f = [];
              if (g <= t) {
                var v = t * (d - 1) + (g - 1);
                b.push(i[v]), f.push(n[v]);
              } else b.push(a(p)), f.push(a(u));
              p.push(b[0]), u.push(f[0]);
              for (
                var h = r[i.indexOf(b[0])].Words.split(","),
                  j = r[i.indexOf(b[0])].rule,
                  z = 0;
                z < h.length;
                ++z
              ) {
                var y = h[z].trim();
                h[z] = y;
              }
              for (var C = 0; C < j.length; ++C) {
                var k = j[C].trim();
                j[C] = k;
              }
              m[e.$parent.appData.language][d].push(h);
            }
            e.ruleSet.push(j);
          }
          for (var A = 25, d = s - 1; d >= 0; ) {
            for (var w = 0; w < l; ++w)
              d >= 0 && (m[e.$parent.appData.language][A][t + w][0] = c[d--]);
            A--;
          }
          (e.$parent.appData.data.dataset[e.$parent.appData.language] =
            m[e.$parent.appData.language]),
            console.log("processed Data - ", m);
        }),
        (e.createLevelNodePosData = function () {
          for (var a in e.levelGroups) {
            var o = e.$parent.appData.screentype2;
            angular.forEach(e.levelGroups[a], function (a, r) {
              (e.$parent.appData.levelData[a.level].labelPos.bottom =
                o[4 * r].bottom),
                (e.$parent.appData.levelData[a.level].labelPos.top = "initial"),
                (e.$parent.appData.levelData[a.level].labelPos.left =
                  o[4 * r].left),
                (e.$parent.appData.levelData[a.level].modes.easy.pos.bottom =
                  o[4 * r + 1].bottom),
                (e.$parent.appData.levelData[a.level].modes.easy.pos.top =
                  "initial"),
                (e.$parent.appData.levelData[a.level].modes.easy.pos.left =
                  o[4 * r + 1].left),
                (e.$parent.appData.levelData[
                  a.level
                ].modes.challenge.pos.bottom = o[4 * r + 2].bottom),
                (e.$parent.appData.levelData[a.level].modes.challenge.pos.top =
                  "initial"),
                (e.$parent.appData.levelData[a.level].modes.challenge.pos.left =
                  o[4 * r + 2].left),
                e.$parent.appData.levelData[a.level].island &&
                  o[4 * r + 3] &&
                  ((e.$parent.appData.levelData[a.level].island.bottom =
                    o[4 * r + 3].bottom),
                  (e.$parent.appData.levelData[a.level].island.top = "initial"),
                  (e.$parent.appData.levelData[a.level].island.left =
                    o[4 * r + 3].left),
                  (e.$parent.appData.levelData[a.level].island.height =
                    o[4 * r + 3].height),
                  (e.$parent.appData.levelData[a.level].island.width =
                    o[4 * r + 3].width));
            });
          }
          console.log(
            "-------------------- COPY THIS IN CONFIG JSON ------------------"
          );
        }),
        (e.enableDevDesign = function () {
          $(".devDesign").each(function (e, a) {
            $(a).css("height", $(a).height() + "px");
          }),
            $(".devDesign").draggable(),
            $(".devDesign.devResize").resizable(),
            $(".devDesign")
              .off("click")
              .on("click", function () {
                return !1;
              });
        }),
        (e.generateJson = function () {
          var e = [];
          $(".devDesign").each(function (a, o) {
            var r = $(".fixedNodeContainer").height(),
              i = {
                name: o.className + " " + a,
                top: o.style.top,
                left: o.style.left,
                bottom: r - (parseInt($(o).css("top")) + $(o).height()) + "px",
              };
            if (o.className.indexOf("levelMode") >= 0) {
              var n = $(o).height(),
                t = 0.6 * $(o).height(),
                l = n - t;
              i.bottom = r - l - (parseInt($(o).css("top")) + t) + "px";
            }
            o.className.indexOf("devResize") >= 0 &&
              ((i.height = $(o).css("height")), (i.width = $(o).css("width"))),
              e.push(i);
          });
        }),
        (e.getDateString = function (e) {
          var a = e.getDate(),
            o = e.getMonth() + 1,
            r = e.getFullYear();
          return (
            a < 10 && (a = "0" + a),
            o < 10 && (o = "0" + o),
            o + "/" + a + "/" + r
          );
        }),
        (e.getTimeString = function (e) {
          e = new Date(e);
          var a = e.getHours(),
            o = e.getMinutes(),
            r = a >= 12 ? "pm" : "am";
          return (
            (a %= 12),
            (a = a || 12),
            (o = o < 10 ? "0" + o : o),
            a + ":" + o + " " + r
          );
        }),
        (e.millisToMinutesAndSeconds = function (a) {
          a = new Date(a);
          var o = Math.floor(a / 6e4),
            r = ((a % 6e4) / 1e3).toFixed(0);
          return (
            (r = r.replace(/^0+/, "")),
            o + " min " + r + " " + e.languageTxt.secondText
          );
        });
    },
  ]),
  myView.filter("unsafe", function () {
    return function (e) {
      var a = {
        "Palabras de ortografï¿½a": "Palabras de ortografía",
        "Mayï¿½s": "Mayús",
        capNÑ: "Ñ",
        "capNï¿½": "Ñ",
        capAÁ: "Á",
        "capAï¿½": "Á",
        capEÉ: "É",
        "capEï¿½": "É",
        capIÍ: "Í",
        "capIï¿½": "Í",
        capOÓ: "Ó",
        "capOï¿½": "Ó",
        capUÚ: "Ú",
        "capUï¿½": "Ú",
        capUUÜ: "Ü",
        "capUUï¿½": "Ü",
        smallnñ: "ñ",
        "smallnï¿½": "ñ",
        smallaá: "á",
        "smallaï¿½": "á",
        smalleé: "é",
        "smalleï¿½": "é",
        smallií: "í",
        "smalliï¿½": "í",
        smalloó: "ó",
        "smalloï¿½": "ó",
        smalluú: "ú",
        "smalluï¿½": "ú",
        smalluuü: "ü",
        "smalluuï¿½": "ü",
        "cafï¿½": "café",
        "trampolï¿½n": "trampolín",
        "trampollï¿½n": "trampollín",
        "floristerï¿½a": "floristería",
        "florï¿½steria": "florísteria",
        "ajï¿½": "ají",
        "agï¿½": "agí",
        "agitaciï¿½n": "agitación",
        "ajitaciï¿½n": "ajitación",
        "construï¿½": "construí",
        "construyï¿½": "construyí",
        "costruï¿½": "costruí",
        "mediodï¿½a": "mediodía",
        "mediadï¿½a": "mediadía",
        "telaraï¿½a": "telaraña",
        "telaaraï¿½a": "telaaraña",
        "teleraï¿½a": "teleraña",
        "dï¿½a": "día",
        "grï¿½a": "grúa",
        "gurï¿½a": "gurúa",
        "proteï¿½na": "proteína",
        "protoï¿½na": "protoína",
        "reï¿½": "reí",
        "rehï¿½": "rehí",
        "maï¿½z": "maíz",
        "maï¿½s": "maís",
        "paï¿½s": "país",
        "paï¿½z": "paíz",
        "envï¿½o": "envío",
        "henvï¿½o": "henvío",
        "gentï¿½o": "gentío",
        "jentï¿½o": "jentío",
        "baï¿½l": "baúl",
        "bahï¿½l": "bahúl",
        "desilusiï¿½n": "desilusión",
        "desiluciï¿½n": "desilución",
        "asï¿½": "así",
        "acï¿½": "ací",
        "azï¿½car": "azúcar",
        "asï¿½car": "asúcar",
        "cï¿½men": "cómen",
        "comï¿½n": "comén",
        "ganï¿½": "ganó",
        "gï¿½no": "gáno",
        "apï¿½nas": "apénas",
        "ï¿½penas": "ápenas",
        "canciï¿½n": "canción",
        "cï¿½ncion": "cáncion",
        "tesï¿½ro": "tesóro",
        "tesorï¿½": "tesoró",
        "detrï¿½s": "detrás",
        "dï¿½tras": "détras",
        "valï¿½r": "valór",
        "vï¿½lor": "válor",
        "fï¿½cil": "fácil",
        "facï¿½l": "facíl",
        "ï¿½guila": "águila",
        "aguï¿½la": "aguíla",
        "brï¿½jula": "brújula",
        "brujulï¿½": "brujulá",
        "cientï¿½fico": "científico",
        "ciï¿½ntifico": "ciéntifico",
        "dï¿½cada": "década",
        "decï¿½da": "decáda",
        "quï¿½taselo": "quítaselo",
        "quitasï¿½lo": "quitasélo",
        "levï¿½ntate": "levántate",
        "levantï¿½te": "levantáte",
        "murciï¿½lago": "murciélago",
        "murcielï¿½go": "murcielágo",
        "sï¿½bado": "sábado",
        "sabï¿½do": "sabádo",
        "entrï¿½gamelo": "entrégamelo",
        "entregï¿½melo": "entregámelo",
        "ï¿½nico": "único",
        "unï¿½co": "uníco",
        "bï¿½ho": "búho",
        "bï¿½o": "búo",
        "vehï¿½culo": "vehículo",
        "veï¿½culo": "veículo",
        "bahï¿½a": "bahía",
        "baï¿½a": "baía",
        "ahijï¿½do": "ahijádo",
        "helï¿½do": "heládo",
        "hoguï¿½ra": "hoguéra",
        "ahorrï¿½r": "ahorrár",
        "ahumï¿½r": "ahumár",
        "ï¿½tiles": "útiles",
        "jï¿½ntos": "júntos",
        "lï¿½pices": "lápices",
        "lï¿½picez": "lápicez",
        "lï¿½pizez": "lápizez",
        "camiï¿½n": "camión",
        "cï¿½mion": "cámion",
        "marï¿½timo": "marítimo",
        "marï¿½stimo": "marístimo",
        "demï¿½s": "demás",
        "demï¿½z": "demáz",
        "aï¿½reo": "aéreo",
        "ï¿½ereo": "áereo",
        "ganï¿½do": "ganádo",
        "pingï¿½ino": "pingüino",
        "pengï¿½ino": "pengüino",
        "desagï¿½e": "desagüe",
        "bilingï¿½e": "bilingüe",
        "algï¿½nos": "algünos",
        "niï¿½ez": "niñez",
        "niï¿½es": "niñes",
        "bondï¿½": "bondá",
        "mirarï¿½": "miraré",
        "merarï¿½": "meraré",
        "jugï¿½": "jugó",
        "jï¿½go": "júgo",
        "cambiï¿½": "cambió",
        "cï¿½mbio": "cámbio",
        "escribï¿½": "escribé",
        "saltï¿½": "saltó",
        "sï¿½lto": "sálto",
        "cambiï¿½": "cambió",
        "cï¿½mbio": "cámbio",
        "volverï¿½": "volveré",
        "volvï¿½re": "volvére",
        "serï¿½": "seré",
        "sï¿½re": "sére",
        "saltï¿½": "salté",
        "sï¿½lte": "sálte",
        "votarï¿½": "votaré",
        "votï¿½re": "votáre",
        "ï¿½l": "él",
        "hï¿½l": "hél",
        "ï¿½l": "él",
        "sï¿½": "sí",
        "cï¿½": "cí",
        "mï¿½": "mí",
        "quï¿½": "qué",
        "qï¿½": "qé",
        "quï¿½": "qué",
        "cï¿½mo": "cómo",
        "kï¿½mo": "kómo",
        "sï¿½is": "séis",
        "difï¿½cil": "difícil",
        "difï¿½sil": "difísil",
        "avanzï¿½": "avanzó",
        "avansï¿½": "avansó",
        "narï¿½z": "naríz",
        "sï¿½mbolo": "símbolo",
        "sï¿½nbolo": "sínbolo",
        "sï¿½mvolo": "símvolo",
        "compï¿½s": "compás",
        "conpï¿½s": "conpás",
        "compï¿½z": "compáz",
        "sonreï¿½do": "sonreído",
        "somreï¿½do": "somreído",
        "traï¿½do": "traído",
        "trahï¿½do": "trahído",
        "aï¿½reo": "aéreo",
        "aï¿½rio": "aério",
        "hï¿½roe": "héroe",
        "hï¿½rue": "hérue",
        "camaleï¿½n": "camaleón",
        "kamaleï¿½n": "kamaleón",
        "aereolï¿½nea": "aereolínea",
        "aereolï¿½nea": "aereolínea",
        "poesï¿½a": "poesía",
        "puesï¿½a": "puesía",
        "geï¿½grafo": "geógrafo",
        "jeï¿½grafo": "jeógrafo",
        "canï¿½a": "canúa",
        "pasï¿½a": "pasía",
        "biografï¿½a": "biografía",
        "viografï¿½a": "viografía",
        "actï¿½a": "actúa",
        "hactï¿½a": "hactúa",
        "sonreï¿½rse": "sonreírse",
        "sonrreï¿½rse": "sonrreírse",
        "maï¿½z": "maíz",
        "maï¿½s": "maís",
        "sabï¿½a": "sabía",
        "savï¿½a": "savía",
        "habï¿½a": "había",
        "havï¿½a": "havía",
        "rï¿½o": "río",
        "rrï¿½o": "rrío",
        "recaï¿½da": "recaída",
        "rrecaï¿½da": "rrecaída",
        "distraï¿½do": "distraído",
        "destraï¿½do": "destraído",
        "gentï¿½o": "gentío",
        "jentï¿½o": "jentío",
        "baï¿½l": "baúl",
        "vaï¿½l": "vaúl",
        "proteï¿½na": "proteína",
        "protenï¿½a": "protenía",
        "aï¿½lla": "aúlla",
        "aï¿½ya": "aúya",
        "garantï¿½a": "garantía",
        "garentï¿½a": "garentía",
        "bohï¿½o": "bohío",
        "vohï¿½o": "vohío",
        "cacatï¿½a": "cacatúa",
        "kakatï¿½a": "kakatúa",
        "Raï¿½l": "Raúl",
        "Marï¿½a": "María",
        "Marrï¿½a": "Marría",
        "baterï¿½a": "batería",
        "vaterï¿½a": "vatería",
        "mï¿½o": "mío",
        "mï¿½u": "míu",
        "inacciï¿½n": "inacción",
        "inaxiï¿½n": "inaxión",
        "sobreactuï¿½r": "sobreactuár",
        "sobresalï¿½r": "sobresalír",
        "subacuï¿½tico": "subacuático",
        "suvacuï¿½tico": "suvacuático",
        "subestaciï¿½n": "subestación",
        "suvestaciï¿½n": "suvestación",
        "imï¿½genes": "imágenes",
        "imï¿½jenes": "imájenes",
        "lï¿½pices": "lápices",
        "lï¿½pizes": "lápizes",
        "lï¿½pises": "lápises",
        "telï¿½fonos": "teléfonos",
        "telï¿½fones": "teléfones",
        "lugï¿½ares": "lugüares",
        "dï¿½adema": "díadema",
        "reuniï¿½n": "reunión",
        "riuniï¿½n": "riunión",
        "bï¿½isbol": "béisbol",
        "beisbï¿½l": "beisból",
        "vï¿½isbol": "véisbol",
        "ruï¿½nas": "ruínas",
        "ruï¿½do": "ruído",
        "fuï¿½": "fuí",
        "foï¿½": "foí",
        "incluï¿½do": "incluído",
        "ruiseï¿½or": "ruiseñor",
        "ruiceï¿½or": "ruiceñor",
        "intuiciï¿½n": "intuición",
        "intuisiï¿½n": "intuisión",
        "biologï¿½a": "biología",
        "biolojï¿½a": "biolojía",
        "biografï¿½a": "biografía",
        "beografï¿½a": "beografía",
        "fonï¿½ma": "fonéma",
        "fonï¿½tica": "fonética",
        "fonï¿½tika": "fonétika",
        "polï¿½glota": "políglota",
        "pulï¿½glota": "pulíglota",
        "fonografï¿½a": "fonografía",
        "fonogrefï¿½a": "fonogrefía",
        "grï¿½fico": "gráfico",
        "grï¿½fiko": "gráfiko",
        "monolingï¿½e": "monolingüe",
        "monografï¿½a": "monografía",
        "monegrafï¿½a": "monegrafía",
        "grafologï¿½a": "grafología",
        "grafolojï¿½a": "grafolojía",
        "policï¿½falo": "policéfalo",
        "polisï¿½falo": "poliséfalo",
        "polï¿½gono": "polígono",
        "polï¿½gomo": "polígomo",
        "policromï¿½a": "policromía",
        "polikromï¿½a": "polikromía",
        "acuï¿½rio": "acuário",
        "acuï¿½tico": "acuático",
        "hacuï¿½tico": "hacuático",
        "acuanï¿½uta": "acuanáuta",
        "acuï¿½so": "acuóso",
        "acuarï¿½la": "acuaréla",
        "acuï¿½fero": "acuífero",
        "aquï¿½fero": "aquífero",
        "dicciï¿½n": "dicción",
        "dixiï¿½n": "dixión",
        "dicsiï¿½n": "dicsión",
        "dictï¿½do": "dictádo",
        "dictï¿½r": "dictár",
        "dictï¿½men": "dictámen",
        "edï¿½cto": "edícto",
        "veredï¿½cto": "veredícto",
        "dictaminï¿½r": "dictaminár",
        "dictadï¿½r": "dictadór",
        "aï¿½reo": "aéreo",
        "haï¿½reo": "haéreo",
        "ï¿½ire": "áire",
        "cï¿½mara": "cámara",
        "kï¿½mara": "kámara",
        "camarï¿½grafo": "camarógrafo",
        "camarogrï¿½fo": "camarográfo",
        "composiciï¿½n": "composición",
        "composisiï¿½n": "composisión",
        "fï¿½cil": "fácil",
        "fï¿½sil": "fásil",
        "imï¿½gen": "imágen",
        "imï¿½genes": "imágenes",
        "imï¿½jenes": "imájenes",
        "necesitarï¿½a": "necesitaría",
        "nececitarï¿½a": "nececitaría",
        "nesesitarï¿½a": "nesesitaría",
        "produxiï¿½n": "produxión",
        "producsiï¿½n": "producsión",
        "reï¿½ne": "reúne",
        "rreï¿½ne": "rreúne",
        "reuniï¿½n": "reunión",
        "rreuniï¿½n": "rreunión",
        "Panamï¿½": "Panamá",
        "Pamamï¿½": "Pamamá",
        "guaranï¿½": "guaraná",
        "waranï¿½": "waraná",
        "chimpancï¿½": "chimpancé",
        "chimpansï¿½": "chimpansé",
        "comitï¿½": "comité",
        "cometï¿½": "cometé",
        "jamï¿½s": "jamás",
        "jammï¿½s": "jammás",
        "ajonjolï¿½": "ajonjolí",
        "agonjolï¿½": "agonjolí",
        "colibrï¿½": "colibrí",
        "colivrï¿½": "colivrí",
        "conclusiï¿½n": "conclusión",
        "concluciï¿½n": "conclución",
        "acciï¿½n": "acción",
        "axiï¿½n": "axión",
        "acsiï¿½n": "acsión",
        "algodï¿½n": "algodón",
        "halgodï¿½n": "halgodón",
        "ademï¿½s": "además",
        "hademï¿½s": "hademás",
        "dï¿½bil": "débil",
        "dï¿½vil": "dévil",
        "ï¿½rbol": "árbol",
        "ï¿½rvol": "árvol",
        "fï¿½cil": "fácil",
        "fï¿½sil": "fásil",
        "cï¿½sped": "césped",
        "hï¿½bil": "hábil",
        "hï¿½vil": "hávil",
        "difï¿½cil": "difícil",
        "difï¿½sil": "difísil",
        "lï¿½piz": "lápiz",
        "lï¿½pis": "lápis",
        "azï¿½car": "azúcar",
        "asï¿½car": "asúcar",
        "pï¿½ster": "póster",
        "pï¿½sster": "pósster",
        "reacciï¿½n": "reacción",
        "reaxiï¿½n": "reaxión",
        "reacsiï¿½n": "reacsión",
        "misiï¿½n": "misión",
        "miciï¿½n": "mición",
        "canciï¿½n": "canción",
        "cansiï¿½n": "cansión",
        "ilusiï¿½n": "ilusión",
        "iluciï¿½n": "ilución",
        "confusiï¿½n": "confusión",
        "confuciï¿½n": "confución",
        "dedicaciï¿½n": "dedicación",
        "dedicasiï¿½n": "dedicasión",
        "porciï¿½n": "porción",
        "porsiï¿½n": "porsión",
        "divisiï¿½n": "división",
        "diviciï¿½n": "divición",
        "tensiï¿½n": "tensión",
        "tenciï¿½n": "tención",
        "fusiï¿½n": "fusión",
        "fuciï¿½n": "fución",
        "presiï¿½n": "presión",
        "preciï¿½n": "preción",
        "protecciï¿½n": "protección",
        "protexiï¿½n": "protexión",
        "protecsiï¿½n": "protecsión",
        "mansiï¿½n": "mansión",
        "manciï¿½n": "manción",
        "profesiï¿½n": "profesión",
        "profeciï¿½n": "profeción",
        "posiciï¿½n": "posición",
        "posisiï¿½n": "posisión",
        "pociciï¿½n": "pocición",
        "direcciï¿½n": "dirección",
        "direxiï¿½n": "direxión",
        "direcsiï¿½n": "direcsión",
        "emociï¿½n": "emoción",
        "emosiï¿½n": "emosión",
        "hemosiï¿½n": "hemosión",
        "lociï¿½n": "loción",
        "losiï¿½n": "losión",
        "diversiï¿½n": "diversión",
        "diverciï¿½n": "diverción",
        "dibersiï¿½n": "dibersión",
        "estaciï¿½n": "estación",
        "estasiï¿½n": "estasión",
        "Mï¿½xico": "México",
        "lï¿½grimas": "lágrimas",
        "lï¿½gremas": "lágremas",
        "mï¿½sica": "música",
        "mï¿½sika": "músika",
        "vï¿½rtices": "vértices",
        "vï¿½rtises": "vértises",
        "dï¿½cada": "década",
        "dï¿½kada": "dékada",
        "rï¿½pido": "rápido",
        "rrï¿½pido": "rrápido",
        "pï¿½blico": "público",
        "pï¿½bliko": "públiko",
        "esdrï¿½jula": "esdrújula",
        "sdrï¿½jula": "sdrújula",
        "ï¿½ngulo": "ángulo",
        "ï¿½ngï¿½lo": "ángülo",
        "pï¿½jaro": "pájaro",
        "pï¿½garo": "págaro",
        "nï¿½madas": "nómadas",
        "nï¿½madas": "námadas",
        "recomiï¿½ndaselo": "recomiéndaselo",
        "recomiï¿½ndacelo": "recomiéndacelo",
        "vï¿½monos": "vámonos",
        "bï¿½monos": "bámonos",
        "llï¿½vaselo": "llévaselo",
        "llï¿½vacelo": "llévacelo",
        "pï¿½samelo": "pásamelo",
        "pï¿½zamelo": "pázamelo",
        "cuï¿½ntamela": "cuéntamela",
        "kuï¿½ntamela": "kuéntamela",
        "regï¿½lasela": "regálasela",
        "rejï¿½lasela": "rejálasela",
        "devuï¿½lvemelo": "devuélvemelo",
        "debuï¿½lvemelo": "debuélvemelo",
        "aprï¿½ndetela": "apréndetela",
        "aprendetelï¿½": "aprendetelá",
        "prï¿½stamelo": "préstamelo",
        "prestamelï¿½": "prestameló",
        "almohï¿½da": "almoháda",
        "ahogï¿½do": "ahogádo",
        "bahï¿½a": "bahía",
        "baï¿½a": "baía",
        "turbohï¿½lice": "turbohélice",
        "turbohï¿½lise": "turbohélise",
        "turvohï¿½lice": "turvohélice",
        "ahï¿½nco": "ahínco",
        "aï¿½nco": "aínco",
        "alcï¿½l": "alcól",
        "alchï¿½l": "alchól",
        "zoolï¿½gico": "zoológico",
        "zolï¿½gico": "zológico",
        "soolï¿½gico": "soológico",
        "prohï¿½ben": "prohíben",
        "proï¿½ben": "proíben",
        "prohï¿½ven": "prohíven",
        "vehï¿½culo": "vehículo",
        "veï¿½culo": "veículo",
        "releyï¿½": "releyó",
        "relellï¿½": "relelló",
        "releiï¿½": "releió",
        "antisï¿½smico": "antisísmico",
        "antesï¿½smico": "antesísmico",
        "antiï¿½cido": "antiácido",
        "anteï¿½cido": "anteácido",
        "antiï¿½sido": "antiásido",
        "antiatï¿½mico": "antiatómico",
        "anteatï¿½mico": "anteatómico",
        "reagrupï¿½": "reagrupó",
        "regrupï¿½": "regrupó",
        "dormirï¿½s": "dormirás",
        "caminarï¿½": "caminaré",
        "camimarï¿½": "camimaré",
        "saldrï¿½amos": "saldríamos",
        "zaldrï¿½amos": "zaldríamos",
        "visitarï¿½s": "visitarás",
        "vicitarï¿½s": "vicitarás",
        "mirarï¿½": "miraré",
        "mirrarï¿½": "mirraré",
        "verï¿½s": "verás",
        "berï¿½s": "berás",
        "comerï¿½an": "comerían",
        "komerï¿½an": "komerían",
        "estarï¿½n": "estarán",
        "eztarï¿½n": "eztarán",
        "pasï¿½bamos": "pasábamos",
        "pasï¿½vamos": "pasávamos",
        "comï¿½": "comí",
        "komï¿½": "komí",
        "volverï¿½n": "volverán",
        "volberï¿½n": "volberán",
        "podrï¿½s": "podrás",
        "podrï¿½z": "podráz",
        "dï¿½bamos": "dábamos",
        "saltarï¿½a": "saltaría",
        "zaltarï¿½a": "zaltaría",
        "nadarï¿½a": "nadaría",
        "nadï¿½ria": "nadária",
        "trabajï¿½": "trabajó",
        "trabï¿½jo": "trabájo",
        "pasï¿½": "pasó",
        "pï¿½so": "páso",
        "ï¿½bamos": "íbamos",
        "ï¿½vamos": "ívamos",
        "cultivarï¿½a": "cultivaría",
        "cultibarï¿½a": "cultibaría",
        "fuï¿½ramos": "fuéramos",
        "fuerï¿½mos": "fuerámos",
        "fonometrï¿½a": "fonometría",
        "fonemetrï¿½a": "fonemetría",
        "fonï¿½tica": "fonética",
        "fonï¿½tica": "fonótica",
        "microbï¿½s": "microbús",
        "mecrobï¿½s": "mecrobús",
        "perï¿½metro": "perímetro",
        "pirï¿½metro": "pirímetro",
        "megï¿½fono": "megáfono",
        "meguï¿½fono": "meguáfono",
        "megalï¿½polis": "megalópolis",
        "megualï¿½polis": "megualópolis",
        "telï¿½fono": "teléfono",
        "tilï¿½fono": "tiléfono",
        "micrï¿½fono": "micrófono",
        "mecrï¿½fono": "mecrófono",
        "anglï¿½fono": "anglófono",
        "botï¿½r": "botár",
        "votï¿½r": "votár",
        "hï¿½cho": "hécho",
        "ï¿½cho": "écho",
        "cï¿½llo": "cállo",
        "cï¿½yo": "cáyo",
        "hï¿½la": "hóla",
        "ï¿½la": "óla",
        "hï¿½ndas": "hóndas",
        "ï¿½ndas": "óndas",
        "ï¿½sta": "ásta",
        "hï¿½sta": "hásta",
        "tï¿½bo": "túbo",
        "tï¿½vo": "túvo",
        "cosï¿½r": "cosér",
        "cocï¿½r": "cocér",
        "portï¿½til": "portátil",
        "portï¿½tel": "portátel",
        "portï¿½ro": "portéro",
        "aportï¿½r": "aportár",
        "portï¿½da": "portáda",
        "genealogï¿½a": "genealogía",
        "genealojï¿½a": "genealojía",
        "genialogï¿½a": "genialogía",
        "generaciï¿½n": "generación",
        "jeneraciï¿½n": "jeneración",
        "generasiï¿½n": "generasión",
        "generï¿½l": "generál",
        "generï¿½r": "generár",
        "duraciï¿½n": "duración",
        "durasiï¿½n": "durasión",
        "duraziï¿½n": "durazión",
        "durï¿½za": "duréza",
        "duradï¿½ro": "duradéro",
        "proyï¿½cto": "proyécto",
        "proyectï¿½r": "proyectór",
        "trayï¿½cto": "trayécto",
        "inyectï¿½r": "inyectár",
        "genï¿½tica": "genética",
        "jenï¿½tica": "jenética",
        "regenerï¿½r": "regenerár",
        "temprï¿½no": "tempráno",
        "contramï¿½no": "contramáno",
        "humï¿½no": "humáno",
        "lozï¿½na": "lozána",
        "andinï¿½smo": "andinísmo",
        "naturalï¿½sta": "naturalísta",
        "pianï¿½sta": "pianísta",
        "aï¿½n": "aún",
        "haï¿½n": "haún",
        "ahï¿½n": "ahún",
        "dï¿½": "dé",
        "ddï¿½": "ddé",
        "dï¿½e": "dée",
        "hï¿½l": "hél",
        "mï¿½s": "más",
        "mmï¿½s": "mmás",
        "mï¿½as": "máas",
        "mï¿½i": "míi",
        "mmï¿½": "mmí",
        "sï¿½": "sé",
        "sï¿½e": "sée",
        "ssï¿½": "ssí",
        "sï¿½i": "síi",
        "tï¿½": "té",
        "ttï¿½": "tté",
        "tï¿½e": "tée",
        "tï¿½": "tú",
        "tï¿½u": "túu",
        "ttï¿½": "ttú",
        "quï¿½": "qué",
        "quuï¿½": "quué",
        "quï¿½e": "quée",
        "excï¿½ntrico": "excéntrico",
        "exï¿½ntrico": "exéntrico",
        "exsï¿½ntrico": "exséntrico",
        "posmodï¿½rno": "posmodérno",
        "biaï¿½ual": "biañual",
        "biangï¿½lar": "biangülar",
        "triï¿½ngulo": "triángulo",
        "triï¿½ngï¿½lo": "triángülo",
        "triatlï¿½n": "triatlón",
        "trisatlï¿½n": "trisatlón",
        "transacciï¿½n": "transacción",
        "transacsiï¿½n": "transacsión",
        "transaciï¿½n": "transación",
        "televisiï¿½n": "televisión",
        "televiciï¿½n": "televición",
        "telecomunicaciï¿½n": "telecomunicación",
        "telecomunicasiï¿½n": "telecomunicasión",
        "telefonï¿½a": "telefonía",
        "telfonï¿½a": "telfonía",
        "fotografï¿½a": "fotografía",
        "fotogrefï¿½a": "fotogrefía",
        "biografï¿½a": "biografía",
        "bigrafï¿½a": "bigrafía",
        "biologï¿½a": "biología",
        "biolojï¿½a": "biolojía",
        "metrologï¿½a": "metrología",
        "metrolojï¿½a": "metrolojía",
        "metrilogï¿½a": "metrilogía",
        "fonï¿½grafo": "fonógrafo",
        "fonogrï¿½fo": "fonográfo",
        "telepatï¿½a": "telepatía",
        "telpatï¿½a": "telpatía",
        "telefï¿½rico": "teleférico",
        "telesfï¿½rico": "telesférico",
        "biomï¿½trico": "biométrico",
        "bimï¿½trico": "bimétrico",
        "termï¿½metro": "termómetro",
        "termomï¿½tro": "termométro",
        "cronï¿½metro": "cronómetro",
        "cronomï¿½tro": "cronométro",
        "apï¿½grafo": "apógrafo",
        "apogrï¿½fo": "apográfo",
        "psicologï¿½a": "psicología",
        "psicolojï¿½a": "psicolojía",
        "psicolï¿½gia": "psicológia",
        "favoritï¿½smo": "favoritísmo",
        "favoritï¿½smo": "favoritísmo",
        "aï¿½robismo": "aérobismo",
        "abolicionï¿½sta": "abolicionísta",
        "biologï¿½a": "biología",
        "biolojï¿½a": "biolojía",
        "biolï¿½gia": "biológia",
        "realï¿½smo": "realísmo",
        "automovilï¿½smo": "automovilísmo",
        "realï¿½sta": "realísta",
        "reï¿½lista": "reálista",
        "tecnologï¿½a": "tecnología",
        "tecnolojï¿½a": "tecnolojía",
        "tecnolï¿½gia": "tecnológia",
        "modï¿½smo": "modísmo",
        "analï¿½sta": "analísta",
        "anï¿½lista": "análista",
        "meteorologï¿½a": "meteorología",
        "meteorolojï¿½a": "meteorolojía",
        "meteorï¿½logia": "meteorólogia",
        "cï¿½vismo": "cívismo",
        "ecologï¿½a": "ecología",
        "ecolojï¿½a": "ecolojía",
        "ecï¿½logia": "ecólogia",
        "racï¿½smo": "racísmo",
        "mitologï¿½a": "mitología",
        "mitolojï¿½a": "mitolojía",
        "mitï¿½logia": "mitólogia",
        "optimï¿½sta": "optimísta",
        "conservasionismï¿½": "conservasionismó",
        "antropologï¿½a": "antropología",
        "antropolojï¿½a": "antropolojía",
        "antrï¿½pologia": "antrópologia",
        "cronologï¿½a": "cronología",
        "cronolojï¿½a": "cronolojía",
        "crï¿½nologia": "crónologia",
        "kilï¿½metro": "kilómetro",
        "quilï¿½metro": "quilómetro",
        "kilomï¿½tro": "kilométro",
        "fotografï¿½a": "fotografía",
        "fotogrï¿½fia": "fotográfia",
        "geologï¿½a": "geología",
        "jeologï¿½a": "jeología",
        "geolojï¿½a": "geolojía",
        "geolï¿½gia": "geológia",
        "cronolï¿½gico": "cronológico",
        "cronolï¿½jico": "cronolójico",
        "cronï¿½logia": "cronólogia",
        "centï¿½metro": "centímetro",
        "sentï¿½metro": "sentímetro",
        "centimï¿½tro": "centimétro",
        "neoclï¿½sico": "neoclásico",
        "nï¿½oclasico": "néoclasico",
        "geï¿½logo": "geólogo",
        "jeï¿½logo": "jeólogo",
        "geolï¿½go": "geológo",
        "crï¿½nico": "crónico",
        "cronï¿½co": "croníco",
        "cronicï¿½": "cronicó",
        "biologï¿½a": "biología",
        "biolojï¿½a": "biolojía",
        "biolï¿½gia": "biológia",
        "neolï¿½tico": "neolítico",
        "nï¿½olitico": "néolitico",
        "neolitï¿½co": "neolitíco",
        "geografï¿½a": "geografía",
        "jeografï¿½a": "jeografía",
        "geogrï¿½fia": "geográfia",
        "fotogï¿½nica": "fotogénica",
        "fotojï¿½nica": "fotojénica",
        "fotï¿½genica": "fotógenica",
        "termï¿½metro": "termómetro",
        "tï¿½rmometro": "térmometro",
        "termomï¿½tro": "termométro",
        "fotosï¿½ntesis": "fotosíntesis",
        "fotocï¿½ntesis": "fotocíntesis",
        "fotosintï¿½sis": "fotosintésis",
        "geometrï¿½a": "geometría",
        "jeometrï¿½a": "jeometría",
        "geomï¿½tria": "geométria",
        "sincrï¿½nizar": "sincrónizar",
        "perï¿½metro": "perímetro",
        "perimï¿½tro": "perimétro",
        "fotoelï¿½ctrico": "fotoeléctrico",
        "fotolï¿½ctrico": "fotoléctrico",
        "fotoelectrï¿½co": "fotoelectríco",
        "geomï¿½trico": "geométrico",
        "jeomï¿½trico": "jeométrico",
        "ï¿½ire": "áire",
        "caï¿½sa": "caúsa",
        "acï¿½ite": "acéite",
        "dï¿½uda": "déuda",
        "deudï¿½": "deudá",
        "trapezï¿½ide": "trapezóide",
        "trapezoï¿½de": "trapezoíde",
        "lï¿½mpia": "límpia",
        "limpï¿½a": "limpía",
        "virrï¿½y": "virréy",
        "buï¿½y": "buéy",
        "miï¿½u": "miáu",
        "violï¿½n": "violín",
        "biolï¿½n": "biolín",
        "veolï¿½n": "veolín",
        "poï¿½ma": "poéma",
        "poemï¿½": "poemá",
        "Uruguï¿½y": "Uruguáy",
        "patalï¿½a": "pataléa",
        "pataleï¿½": "pataleá",
        "diciï¿½mbre": "diciémbre",
        "cualidï¿½d": "cualidád",
        "mediï¿½na": "mediána",
        "medianï¿½": "medianá",
        "guayï¿½ba": "guayába",
        "aguacerï¿½": "aguaceró",
        "audï¿½ble": "audíble",
        "detalladamï¿½nte": "detalladaménte",
        "detallï¿½damente": "detalládamente",
        "rï¿½pidamente": "rápidamente",
        "rapidamï¿½nte": "rapidaménte",
        "rapidï¿½mente": "rapidámente",
        "completï¿½mente": "completámente",
        "difï¿½cilmente": "difícilmente",
        "difï¿½silmente": "difísilmente",
        "dificilmï¿½nte": "dificilménte",
        "cuidadï¿½samente": "cuidadósamente",
        "cuidadosï¿½mente": "cuidadosámente",
        "abundï¿½nte": "abundánte",
        "ayudï¿½nte": "ayudánte",
        "tranquilamï¿½nte": "tranquilaménte",
        "tranquilï¿½mente": "tranquilámente",
        "importï¿½nte": "importánte",
        "iguï¿½lmente": "iguálmente",
        "desodorï¿½nte": "desodoránte",
        "calmï¿½nte": "calmánte",
        "desafiï¿½nte": "desafiánte",
        "sutï¿½lmente": "sutílmente",
        "sï¿½tilmente": "sútilmente",
        "cariï¿½osamente": "cariñosamente",
        "cariï¿½ozamente": "cariñozamente",
        "cariï¿½ï¿½samente": "cariñósamente",
        "justamï¿½nte": "justaménte",
        "jï¿½stamente": "jústamente",
        "atentamï¿½nte": "atentaménte",
        "atï¿½ntamente": "aténtamente",
        "cï¿½ntradictorio": "cóntradictorio",
        "biolï¿½n": "biolín",
        "edificï¿½r": "edificár",
        "edï¿½ficar": "edíficar",
        "portafï¿½lios": "portafólios",
        "pï¿½rtafolios": "pórtafolios",
        "terrï¿½stre": "terréstre",
        "terrestrï¿½": "terrestré",
        "dictadï¿½r": "dictadór",
        "exportï¿½r": "exportár",
        "gratificï¿½r": "gratificár",
        "aterrizï¿½r": "aterrizár",
        "atï¿½rrizar": "atérrizar",
        "veredï¿½cto": "veredícto",
        "personificï¿½r": "personificár",
        "pasapï¿½rte": "pasapórte",
        "terrï¿½za": "terráza",
        "dictï¿½r": "dictár",
        "dictï¿½men": "dictámen",
        "terrï¿½no": "terréno",
        "plastificï¿½r": "plastificár",
        "comportamiï¿½nto": "comportamiénto",
        "trï¿½nsporte": "tránsporte",
        "territï¿½rio": "território",
        "continï¿½a": "continúa",
        "kontinï¿½a": "kontinúa",
        "comtinï¿½a": "comtinúa",
        "continï¿½a": "continóa",
        "gradï¿½an": "gradúan",
        "gredï¿½an": "gredúan",
        "graduï¿½r": "graduár",
        "sï¿½ria": "séria",
        "serï¿½a": "sería",
        "serï¿½a": "seréa",
        "cerï¿½a": "cería",
        "serrï¿½a": "serría",
        "zï¿½bia": "zábia",
        "sabï¿½a": "sabía",
        "zabï¿½a": "zabía",
        "zabï¿½a": "zabéa",
        "sabï¿½a": "sabéa",
        "paï¿½s": "país",
        "paï¿½z": "paíz",
        "pï¿½is": "páis",
        "paisï¿½je": "paisáje",
        "sonrï¿½e": "sonríe",
        "sonrrï¿½e": "sonrríe",
        "sonriï¿½": "sonrió",
        "sonrriï¿½": "sonrrió",
        "somriï¿½": "somrió",
        "sonriï¿½ndome": "sonriéndome",
        "sonrriï¿½ndome": "sonrriéndome",
        "sorriï¿½ndome": "sorriéndome",
        "hiervï¿½": "hiervó",
        "austeridï¿½d": "austeridád",
        "veï¿½amos": "veíamos",
        "beï¿½amos": "beíamos",
        "veiï¿½mos": "veiámos",
        "caimï¿½n": "caimán",
        "caemï¿½n": "caemán",
        "cï¿½iman": "cáiman",
        "espï¿½cio": "espácio",
        "cuï¿½rvo": "cuérvo",
        "sirviï¿½nte": "sirviénte",
        "emociï¿½n": "emoción",
        "emosiï¿½n": "emosión",
        "ï¿½mocion": "émocion",
        "mansiï¿½n": "mansión",
        "manciï¿½n": "manción",
        "mï¿½nsion": "mánsion",
        "tensiï¿½n": "tensión",
        "tenciï¿½n": "tención",
        "tï¿½nsion": "ténsion",
        "corrï¿½r": "corrér",
        "alfilï¿½r": "alfilér",
        "ï¿½lfiler": "álfiler",
        "jabalï¿½": "jabalí",
        "gabalï¿½": "gabalí",
        "jï¿½bali": "jábali",
        "sartï¿½n": "sartén",
        "zartï¿½n": "zartén",
        "sï¿½rten": "sárten",
        "audï¿½z": "audáz",
        "ï¿½udaz": "áudaz",
        "ademï¿½s": "además",
        "hademï¿½s": "hademás",
        "ï¿½demas": "ádemas",
        "jamï¿½s": "jamás",
        "gamï¿½s": "gamás",
        "jï¿½mas": "jámas",
        "sofï¿½": "sofá",
        "zofï¿½": "zofá",
        "sï¿½fa": "sófa",
        "hotï¿½l": "hotél",
        "corazï¿½n": "corazón",
        "corasï¿½n": "corasón",
        "cï¿½razon": "córazon",
        "medï¿½r": "medír",
        "allï¿½": "allí",
        "hallï¿½": "hallí",
        "ayï¿½": "ayí",
        "perejï¿½l": "perejíl",
        "pï¿½rejil": "pérejil",
        "millï¿½n": "millón",
        "miyï¿½n": "miyón",
        "mï¿½llon": "míllon",
        "cafï¿½": "café",
        "kafï¿½": "kafé",
        "cï¿½fe": "cáfe",
        "altitï¿½d": "altitúd",
        "ï¿½ltitud": "áltitud",
        "lï¿½piz": "lápiz",
        "lï¿½pis": "lápis",
        "lapï¿½z": "lapíz",
        "fï¿½rtil": "fértil",
        "fï¿½rtel": "fértel",
        "fertï¿½l": "fertíl",
        "ï¿½gil": "ágil",
        "hï¿½gil": "hágil",
        "ï¿½jil": "ájil",
        "agï¿½l": "agíl",
        "ï¿½ngel": "ángel",
        "ï¿½njel": "ánjel",
        "angï¿½l": "angél",
        "ï¿½til": "útil",
        "hï¿½til": "hútil",
        "utï¿½l": "utíl",
        "mï¿½vil": "móvil",
        "mï¿½bil": "móbil",
        "movï¿½l": "movíl",
        "ï¿½rbol": "árbol",
        "hï¿½rbol": "hárbol",
        "arbï¿½l": "arból",
        "azï¿½car": "azúcar",
        "asï¿½car": "asúcar",
        "ï¿½zucar": "ázucar",
        "crï¿½ter": "cráter",
        "cratï¿½r": "cratér",
        "cï¿½sped": "césped",
        "sï¿½sped": "sésped",
        "cespï¿½d": "cespéd",
        "cuï¿½rno": "cuérno",
        "cuernï¿½": "cuernó",
        "encï¿½ma": "encíma",
        "sï¿½na": "sána",
        "cariï¿½osas": "cariñosas",
        "cariï¿½ozas": "cariñozas",
        "cï¿½riï¿½osas": "cáriñosas",
        "valiï¿½nte": "valiénte",
        "palï¿½bra": "palábra",
        "pï¿½labra": "pálabra",
        "cï¿½rcel": "cárcel",
        "cï¿½rsel": "cársel",
        "carcï¿½l": "carcél",
        "hï¿½mbro": "hómbro",
        "estï¿½ndar": "estándar",
        "hestï¿½ndar": "hestándar",
        "estandï¿½r": "estandár",
        "ustï¿½des": "ustédes",
        "ï¿½stedes": "ústedes",
        "ï¿½ltimo": "último",
        "hï¿½ltimo": "húltimo",
        "ultï¿½mo": "ultímo",
        "fï¿½rmula": "fórmula",
        "formï¿½la": "formúla",
        "formulï¿½": "formulá",
        "lï¿½gica": "lógica",
        "lï¿½jica": "lójica",
        "logicï¿½": "logicá",
        "mï¿½gica": "mágica",
        "mï¿½jica": "májica",
        "magï¿½ca": "magíca",
        "parï¿½sito": "parásito",
        "parï¿½cito": "parácito",
        "pï¿½rasito": "párasito",
        "mecï¿½nico": "mecánico",
        "mecï¿½neco": "mecáneco",
        "mï¿½canico": "mécanico",
        "brï¿½jula": "brújula",
        "brï¿½gula": "brúgula",
        "brujï¿½la": "brujúla",
        "vï¿½ndeselo": "véndeselo",
        "vendesï¿½lo": "vendesélo",
        "cï¿½mpraselo": "cómpraselo",
        "comprasï¿½lo": "comprasélo",
        "esdrï¿½jula": "esdrújula",
        "esdrï¿½gula": "esdrúgula",
        "esdrujï¿½la": "esdrujúla",
        "vï¿½monos": "vámonos",
        "vï¿½mosnos": "vámosnos",
        "vamonï¿½s": "vamonós",
        "pï¿½talo": "pétalo",
        "petalï¿½": "petaló",
        "petï¿½lo": "petálo",
        "prï¿½stamelo": "préstamelo",
        "prestamï¿½lo": "prestamélo",
        "prestamelï¿½": "prestameló",
        "tï¿½matelo": "tómatelo",
        "tomatï¿½lo": "tomatélo",
        "tomatelï¿½": "tomateló",
        "cï¿½metelo": "cómetelo",
        "cometï¿½lo": "cometélo",
        "cometelï¿½": "cometeló",
        "lï¿½mina": "lámina",
        "lamï¿½na": "lamína",
        "laminï¿½": "laminá",
        "ï¿½ndice": "índice",
        "ï¿½ndise": "índise",
        "indicï¿½": "indicé",
        "ï¿½nimo": "ánimo",
        "anï¿½mo": "anímo",
        "animï¿½": "animó",
        "ï¿½dolo": "ídolo",
        "idï¿½lo": "idólo",
        "idolï¿½": "idoló",
        "dï¿½melo": "dímelo",
        "dimï¿½lo": "dimélo",
        "dimelï¿½": "dimeló",
        "cobrï¿½zo": "cobrízo",
        "enfï¿½rmiza": "enférmiza",
        "plomï¿½zo": "plomízo",
        "cobï¿½rtizo": "cobértizo",
        "fronterï¿½zo": "fronterízo",
        "primerï¿½za": "primeríza",
        "caballï¿½riza": "caballériza",
        "advenï¿½dizo": "advenédizo",
        "sï¿½": "sí",
        "ssï¿½": "ssí",
        "sï¿½i": "síi",
        "zï¿½": "zí",
        "sï¿½": "sé",
        "sï¿½e": "sée",
        "ssï¿½": "ssé",
        "dï¿½": "dé",
        "ddï¿½": "ddé",
        "dï¿½e": "dée",
        "mï¿½s": "más",
        "mmï¿½s": "mmás",
        "mï¿½as": "máas",
        "mï¿½z": "máz",
        "tï¿½": "té",
        "ttï¿½": "tté",
        "tï¿½e": "tée",
        "ï¿½l": "él",
        "hï¿½l": "hél",
        "hï¿½l": "hél",
        "tï¿½": "tú",
        "tï¿½u": "túu",
        "ttï¿½": "ttú",
        "mï¿½": "mí",
        "mï¿½i": "míi",
        "mmï¿½": "mmí",
        "cï¿½mo": "cómo",
        "cï¿½mmo": "cómmo",
        "cï¿½omo": "cóomo",
        "quï¿½": "qué",
        "quuï¿½": "quué",
        "quï¿½e": "quée",
        "qï¿½": "qé",
        "pasï¿½bamos": "pasábamos",
        "pasï¿½vamos": "pasávamos",
        "pasï¿½abamos": "paséabamos",
        "apretï¿½": "apreté",
        "aprietï¿½": "aprieté",
        "salï¿½": "salí",
        "zalï¿½": "zalí",
        "salï¿½": "salé",
        "partï¿½": "partí",
        "pï¿½rti": "párti",
        "partï¿½": "parté",
        "dejï¿½": "dejé",
        "degï¿½": "degé",
        "dejï¿½": "dejí",
        "comï¿½amos": "comíamos",
        "comiï¿½mos": "comiámos",
        "comï¿½amos": "coméamos",
        "tomï¿½": "tomé",
        "tï¿½me": "tóme",
        "tomï¿½": "tomí",
        "podrï¿½a": "podría",
        "podrï¿½a": "podréa",
        "pondriï¿½": "pondriá",
        "iniciarï¿½a": "iniciaría",
        "inisiarï¿½a": "inisiaría",
        "iniciariï¿½": "iniciariá",
        "sabrï¿½a": "sabría",
        "zabrï¿½a": "zabría",
        "sï¿½bria": "sábria",
        "habrï¿½a": "habría",
        "hï¿½bria": "hábria",
        "saldrï¿½a": "saldría",
        "zaldrï¿½a": "zaldría",
        "saldriï¿½": "saldriá",
        "comerï¿½a": "comería",
        "comï¿½ria": "coméria",
        "comeriï¿½": "comeriá",
        "irï¿½": "iré",
        "tendrï¿½": "tendré",
        "temdrï¿½": "temdré",
        "tï¿½ndre": "téndre",
        "correrï¿½": "correrá",
        "corrï¿½ra": "corréra",
        "cï¿½rrera": "córrera",
        "imaginarï¿½": "imaginaré",
        "imajinarï¿½": "imajinaré",
        "imï¿½ginare": "imáginare",
        "pagarï¿½": "pagaré",
        "pagï¿½re": "pagáre",
        "pï¿½gare": "págare",
        "viajï¿½bamos": "viajábamos",
        "viagï¿½bamos": "viagábamos",
        "viï¿½jabamos": "viájabamos",
        "esconderï¿½": "esconderé",
        "escondï¿½re": "escondére",
        "ï¿½scondere": "éscondere",
        "apetitï¿½sa": "apetitósa",
        "furiï¿½so": "furióso",
        "ï¿½lgebra": "álgebra",
        "ï¿½ljebra": "áljebra",
        "algï¿½bra": "algébra",
        "divï¿½n": "diván",
        "dibï¿½n": "dibán",
        "dï¿½van": "dívan",
        "ï¿½lixir": "élixir",
        "hazaï¿½a": "hazaña",
        "hasaï¿½a": "hasaña",
        "hï¿½zaï¿½a": "házaña",
        "jinï¿½te": "jinéte",
        "jï¿½nete": "jínete",
        "almacï¿½n": "almacén",
        "almasï¿½n": "almasén",
        "almazï¿½n": "almazén",
        "almï¿½cen": "almácen",
        "albï¿½rca": "albérca",
        "nï¿½car": "nácar",
        "nacï¿½r": "nacár",
        "ojalï¿½": "ojalá",
        "hojalï¿½": "hojalá",
        "ï¿½jala": "ójala",
        "gï¿½itarra": "güitarra",
        "guï¿½tarra": "guítarra",
        "tarï¿½ma": "taríma",
        "tï¿½rima": "tárima",
        "bï¿½renjena": "bérenjena",
        "zanï¿½horia": "zanáhoria",
        "barriï¿½": "barrió",
        "gabï¿½n": "gabán",
        "gï¿½ban": "gában",
        "jazmï¿½n": "jazmín",
        "jasmï¿½n": "jasmín",
        "jï¿½zmin": "jázmin",
        "baï¿½o": "baño",
        "baï¿½io": "bañio",
        "zafrï¿½": "zafrá",
        "zï¿½fra": "záfra",
        "combinaciï¿½n": "combinación",
        "conbinaciï¿½n": "conbinación",
        "combinasiï¿½n": "combinasión",
        "combinacï¿½on": "combinacíon",
        "proviï¿½ne": "proviéne",
        "combï¿½tir": "combátir",
        "congestiï¿½n": "congestión",
        "conjestiï¿½n": "conjestión",
        "comgestiï¿½n": "comgestión",
        "congestï¿½on": "congestíon",
        "confraternï¿½r": "confraternár",
        "prosï¿½guir": "proséguir",
        "confirmaciï¿½n": "confirmación",
        "confirmasiï¿½n": "confirmasión",
        "comfirmaciï¿½n": "comfirmación",
        "confirmacï¿½on": "confirmacíon",
        "componï¿½r": "componér",
        "cï¿½mponer": "cómponer",
        "comparï¿½r": "comparár",
        "cï¿½mparar": "cómparar",
        "epï¿½dermis": "epídermis",
        "compartï¿½r": "compartír",
        "compï¿½rtir": "compártir",
        "promï¿½ver": "promóver",
        "epï¿½centro": "epícentro",
        "compï¿½dre": "compádre",
        "compadrï¿½": "compadré",
        "consegï¿½ir": "consegüir",
        "consï¿½guir": "conséguir",
        "proclamï¿½r": "proclamár",
        "proclï¿½mar": "proclámar",
        "sï¿½perabundancia": "súperabundancia",
        "semicï¿½rculo": "semicírculo",
        "semisï¿½rculo": "semisírculo",
        "semicircï¿½lo": "semicircúlo",
        "superdotï¿½do": "superdotádo",
        "sï¿½perdotado": "súperdotado",
        "antiï¿½cido": "antiácido",
        "antiï¿½sido": "antiásido",
        "antiacï¿½do": "antiacído",
        "sï¿½perponer": "súperponer",
        "supervisiï¿½n": "supervisión",
        "superviciï¿½n": "supervición",
        "supervisï¿½on": "supervisíon",
        "antibiï¿½tico": "antibiótico",
        "antebiï¿½tico": "antebiótico",
        "antibiotï¿½co": "antibiotíco",
        "sï¿½perpoblado": "súperpoblado",
        "anticonstï¿½tucional": "anticonstítucional",
        "sobreactuï¿½r": "sobreactuár",
        "sobrecargï¿½": "sobrecargá",
        "semiolvidï¿½do": "semiolvidádo",
        "sobrehumanï¿½": "sobrehumanó",
        "semiacï¿½bado": "semiacábado",
        "sobrenï¿½mbre": "sobrenómbre",
        "sobrenombrï¿½": "sobrenombré",
        "semidï¿½sierto": "semidésierto",
        "sï¿½bremesa": "sóbremesa",
        "anticuï¿½rpo": "anticuérpo",
        "subterrï¿½neo": "subterráneo",
        "subterranï¿½o": "subterranéo",
        "subï¿½ltero": "subáltero",
        "subdï¿½rector": "subdírector",
        "subrï¿½yar": "subráyar",
        "subgrupï¿½": "subgrupó",
        "translï¿½cido": "translúcido",
        "traslï¿½cido": "traslúcido",
        "translï¿½sido": "translúsido",
        "trï¿½nslucido": "tránslucido",
        "subtï¿½tulo": "subtítulo",
        "sutï¿½tulo": "sutítulo",
        "subtitï¿½lo": "subtitúlo",
        "subdividï¿½r": "subdividír",
        "subestimï¿½r": "subestimár",
        "subï¿½stimar": "subéstimar",
        "fotï¿½grafo": "fotógrafo",
        "fotï¿½grefo": "fotógrefo",
        "fï¿½tografo": "fótografo",
        "microbï¿½s": "microbús",
        "microbï¿½z": "microbúz",
        "mï¿½crobus": "mícrobus",
        "telï¿½scopio": "teléscopio",
        "televisiï¿½n": "televisión",
        "televiziï¿½n": "televizión",
        "televiciï¿½n": "televición",
        "telï¿½vision": "telévision",
        "micrï¿½ondas": "micróondas",
        "autï¿½grafo": "autógrafo",
        "ahutï¿½grafo": "ahutógrafo",
        "ï¿½utografo": "áutografo",
        "telï¿½grama": "telégrama",
        "micrï¿½segundo": "micrósegundo",
        "cinematï¿½grafo": "cinematógrafo",
        "sinematï¿½grafo": "sinematógrafo",
        "cinemï¿½tografo": "cinemátografo",
        "microcirugï¿½a": "microcirugía",
        "microsirugï¿½a": "microsirugía",
        "microcirujï¿½a": "microcirujía",
        "micrï¿½cirugia": "micrócirugia",
        "micrï¿½scopio": "micróscopio",
        "telï¿½spectador": "teléspectador",
        "grafologï¿½a": "grafología",
        "grafolojï¿½a": "grafolojía",
        "grafelogï¿½a": "grafelogía",
        "grafï¿½logia": "grafólogia",
        "bibliï¿½grafo": "bibliógrafo",
        "bivliï¿½grafo": "bivliógrafo",
        "bisbliï¿½grafo": "bisbliógrafo",
        "bibliï¿½grafo": "bibliógrafo",
        "microcï¿½nta": "microcínta",
        "telï¿½grafo": "telégrafo",
        "telï¿½grafo": "telógrafo",
        "tï¿½legrafo": "télegrafo",
        "microclï¿½ma": "microclíma",
        "radiotelefonï¿½a": "radiotelefonía",
        "radiotelofononï¿½a": "radiotelofononía",
        "radiotï¿½lefonia": "radiotélefonia",
        "audiciï¿½n": "audición",
        "audisiï¿½n": "audisión",
        "audiziï¿½n": "audizión",
        "ï¿½udision": "áudision",
        "auditï¿½rio": "auditório",
        "ï¿½udio": "áudio",
        "audiï¿½": "audió",
        "inï¿½udible": "ináudible",
        "audiometrï¿½a": "audiometría",
        "ahudiometrï¿½a": "ahudiometría",
        "audiomï¿½tria": "audiométria",
        "abrï¿½pto": "abrúpto",
        "ruptï¿½ra": "ruptúra",
        "interruptï¿½r": "interruptór",
        "exï¿½brupto": "exábrupto",
        "descrï¿½bir": "descríbir",
        "inscribï¿½r": "inscribír",
        "manuscrï¿½be": "manuscríbe",
        "aspï¿½cto": "aspécto",
        "respï¿½cto": "respécto",
        "espectï¿½culo": "espectáculo",
        "expectï¿½culo": "expectáculo",
        "ecspectï¿½culo": "ecspectáculo",
        "ï¿½spectaculo": "éspectaculo",
        "inspecciï¿½n": "inspección",
        "inspexiï¿½n": "inspexión",
        "inspecsiï¿½n": "inspecsión",
        "inspeccï¿½on": "inspeccíon",
        "ï¿½nspector": "ínspector",
        "erupciï¿½n": "erupción",
        "erucciï¿½n": "erucción",
        "erucsiï¿½n": "erucsión",
        "ojeï¿½r": "ojeár",
        "ojï¿½ar": "ojéar",
        "hogeï¿½r": "hogeár",
        "hojï¿½ar": "hojéar",
        "tambiï¿½n": "también",
        "tanbiï¿½n": "tanbién",
        "tï¿½mbien": "támbien",
        "tan biï¿½n": "tan bién",
        "hï¿½ber": "háber",
        "ha vï¿½r": "ha vér",
        "avï¿½r": "avér",
        "asimï¿½smo": "asimísmo",
        "asï¿½mismo": "asímismo",
        "ï¿½simismo": "ásimismo",
        "a sï¿½ mismo": "a sí mismo",
        "ï¿½ si mismo": "á si mismo",
        "sï¿½no": "síno",
        "sinï¿½": "sinó",
        "sï¿½ no": "sí no",
        "si nï¿½": "si nó",
        "tampï¿½co": "tampóco",
        "tï¿½mpoco": "támpoco",
        "tam pï¿½co": "tam póco",
        "tï¿½n poco": "tán poco",
        "hï¿½cho": "hécho",
        "hï¿½hco": "héhco",
        "ï¿½cho": "écho",
        "porqï¿½": "porqé",
        "porqiï¿½": "porqié",
        "por quï¿½": "por qué",
        "pï¿½r quï¿½": "pór qué",
        "pï¿½r que": "pór que",
        "reusï¿½r": "reusár",
        "reuhsï¿½r": "reuhsár",
        "rehï¿½sar": "rehúsar",
        "reï¿½sar": "reúsar",
        "reusï¿½r": "reusár",
        "rï¿½usar": "réusar",
        "en tï¿½rno": "en tórno",
        "ï¿½n torno": "én torno",
        "entï¿½rno": "entórno",
        "ï¿½ntorno": "éntorno",
        "composiciï¿½n": "composición",
        "compociciï¿½n": "compocición",
        "composisiï¿½n": "composisión",
        "composicï¿½on": "composicíon",
        "escenï¿½rio": "escenário",
        "excï¿½ntrico": "excéntrico",
        "exï¿½ntrico": "exéntrico",
        "eccï¿½ntrico": "eccéntrico",
        "fï¿½scinar": "fáscinar",
        "agï¿½jero": "agújero",
        "bohï¿½mio": "bohémio",
        "calï¿½bozo": "calábozo",
        "exchï¿½bir": "exchíbir",
        "pï¿½scuezo": "péscuezo",
        "enhï¿½brar": "enhébrar",
        "grisï¿½ceo": "grisáceo",
        "grisï¿½seo": "grisáseo",
        "grizï¿½ceo": "grizáceo",
        "hï¿½bitat": "hábitat",
        "hï¿½bitad": "hábitad",
        "habitï¿½t": "habitát",
        "hï¿½billa": "hébilla",
        "higiï¿½nico": "higiénico",
        "higï¿½nico": "higénico",
        "hijiï¿½nico": "hijiénico",
        "hipï¿½tesis": "hipótesis",
        "hipï¿½tecis": "hipótecis",
        "ipï¿½tesis": "ipótesis",
        "lombrï¿½z": "lombríz",
        "relojï¿½ro": "relojéro",
        "extermï¿½nador": "extermínador",
        "pï¿½sajero": "pásajero",
        "mï¿½sero": "mésero",
        "carpintï¿½ra": "carpintéra",
        "hormigï¿½ero": "hormigüero",
        "hï¿½rmiguero": "hórmiguero",
        "nï¿½dador": "nádador",
        "remï¿½lcador": "remólcador",
        "despertadï¿½r": "despertadór",
        "despï¿½rtador": "despértador",
        "operadï¿½ra": "operadóra",
        "opï¿½radora": "opéradora",
        "limonï¿½ro": "limonéro",
        "limï¿½nero": "limónero",
        "cochï¿½ra": "cochéra",
        "reparadï¿½ra": "reparadóra",
        "contadï¿½r": "contadór",
        "diseï¿½adora": "diseñadora",
        "deseï¿½adora": "deseñadora",
        "diseï¿½ï¿½dor": "diseñádor",
        "licuadï¿½ra": "licuadóra",
        "licuï¿½dora": "licuádora",
        "calculadï¿½ra": "calculadóra",
        "cï¿½lculadora": "cálculadora",
        "costurï¿½ra": "costuréra",
        "cï¿½sturera": "cósturera",
        "iingenï¿½era": "iingeníera",
        "ï¿½samblea": "ásamblea",
        "bï¿½nquete": "bánquete",
        "cï¿½bina": "cábina",
        "detï¿½lle": "detálle",
        "dï¿½talle": "détalle",
        "chofï¿½r": "chofér",
        "chï¿½fer": "chófer",
        "bebï¿½": "bebé",
        "bevï¿½": "bevé",
        "biebï¿½": "biebé",
        "departamï¿½nto": "departaménto",
        "chï¿½f": "chéf",
        "etï¿½pa": "etápa",
        "flï¿½cha": "flécha",
        "flechï¿½": "flechá",
        "carnï¿½": "carné",
        "carnï¿½d": "carnéd",
        "karnï¿½": "karné",
        "jardï¿½n": "jardín",
        "gardï¿½n": "gardín",
        "jï¿½rdin": "járdin",
        "chaquï¿½ta": "chaquéta",
        "chï¿½queta": "cháqueta",
        "merengï¿½e": "merengüe",
        "mï¿½rengue": "mérengue",
        "nortï¿½": "norté",
        "pantalï¿½n": "pantalón",
        "pantï¿½lon": "pantálon",
        "pï¿½ntalon": "pántalon",
        "aviï¿½n": "avión",
        "haviï¿½n": "havión",
        "ï¿½vion": "ávion",
        "bï¿½jito": "bájito",
        "viï¿½jita": "viéjita",
        "pokitï¿½co": "pokitíco",
        "pï¿½quitico": "póquitico",
        "ratï¿½to": "ratíto",
        "pequeï¿½ita": "pequeñita",
        "pekeï¿½ita": "pekeñita",
        "pequeï¿½itia": "pequeñitia",
        "gatï¿½ta": "gatíta",
        "pisotï¿½n": "pisotón",
        "pizotï¿½n": "pizotón",
        "pisï¿½ton": "pisóton",
        "taconï¿½zo": "taconázo",
        "zapatï¿½nes": "zapatónes",
        "zapatonï¿½s": "zapatonés",
        "respondï¿½n": "respondón",
        "rezpondï¿½n": "rezpondón",
        "respï¿½ndon": "respóndon",
        "grandï¿½te": "grandóte",
        "pelotï¿½zo": "pelotázo",
        "botellï¿½n": "botellón",
        "boteyï¿½n": "boteyón",
        "bï¿½tellon": "bótellon",
        "golï¿½zo": "golázo",
        "golazï¿½": "golazó",
        "golpetï¿½zo": "golpetázo",
        "gï¿½lpetazo": "gólpetazo",
        "grandulï¿½n": "grandulón",
        "grandï¿½lon": "grandúlon",
      };
      return e in a ? a[e] : e;
    };
  }),
  myView.directive("viewDirective", function () {
    return {
      retrict: "E",
      replace: !0,
      scope: !0,
      controller: "viewCtrl",
      templateUrl: "templates/view.html",
      link: function (e, a, o) {},
    };
  });
