var NeatoDemoApp = {
  robot: null,

  initialize: function() {
    this.guiInitializeEvents();
  },

  // robot state
  connect: function() {
    var self = this
      , $serial = $("#serial")
      , $secretKey = $("#secret_key");

    this.guiDisableConnect();

    // initialize robot object
    this.robot = new Neato.Robot($serial.val(), $secretKey.val(), {
      onConnected: function() {
        console.log(this.serial + " got connected");
      },
      onDisconnected: function(status, json) {
        console.log(this.serial + " got disconnected");
        self.guiReset();
      },
      onStateChange: function() {
        console.log(this.serial + " got new state:", this.state);
        self.onStateChange();
      }
    });
    this.robot.connect();
  },

  disconnect: function() {
    this.robot.disconnect();
  },

  onStateChange: function() {
    var $robotState = $("#robot_state");
    // commands
    this.guiEnableRobotCommands();
    // log
    var prettyState = JSON.stringify(this.robot.state, null, 2);
    $robotState.html(prettyState);
  },

  getAvailableCommands: function() {
    if (this.robot.state) {
      return this.robot.state.availableCommands;
    } else {
      return null;
    }
  },

  // GUI
  guiInitializeEvents: function() {
    var self = this;

    $("#connect").click(function() { self.connect(); });
    $("#disconnect").click(function() { self.disconnect(); });

    $("#cmd_start").click(function() { self.startOrResume(); });
    $("#cmd_pause").click(function() { self.pauseCleaning(); });
    $("#cmd_stop").click(function() { self.stopCleaning(); });
    $("#cmd_send_to_base").click(function() { self.sendToBase(); });
  },

  guiEnableConnect: function() {
    var $connect = $("#connect")
      , $disconnect = $("#disconnect")
      , $serial = $("#serial")
      , $secretKey = $("#secret_key");

    $connect.prop('disabled', false);
    $disconnect.prop('disabled', true);
    $serial.prop('disabled', false);
    $secretKey.prop('disabled', false);
  },

  guiDisableConnect: function() {
    var $connect = $("#connect")
      , $disconnect = $("#disconnect")
      , $serial = $("#serial")
      , $secretKey = $("#secret_key");

    // disable gui
    $connect.prop('disabled', true);
    $disconnect.prop('disabled', false);
    $serial.prop('disabled', true);
    $secretKey.prop('disabled', true);
  },

  guiEnableRobotCommands: function() {
    var availableCommands = this.getAvailableCommands();
    if (!availableCommands) { return; }

    $("#cmd_start").prop('disabled', !(availableCommands.start || availableCommands.resume));
    $("#cmd_pause").prop('disabled', !availableCommands.pause);
    $("#cmd_stop").prop('disabled', !availableCommands.stop);
    $("#cmd_send_to_base").prop('disabled', !availableCommands.goToBase);
  },

  guiDisableRobotCommands: function() {
    $("#cmd_start").prop('disabled', true);
    $("#cmd_pause").prop('disabled', true);
    $("#cmd_stop").prop('disabled', true);
    $("#cmd_send_to_base").prop('disabled', true);
  },

  guiReset: function() {
    var $robotState = $("#robot_state");

    this.guiDisableRobotCommands();
    this.guiEnableConnect();

    $robotState.html("");

    this.guiEnableConnect();
  },

  // robot commands
  startOrResume: function() {
    var availableCommands = this.getAvailableCommands();
    if (!availableCommands) { return; }

    if (availableCommands.start) {
      this.startHouseCleaning();
    } else if (availableCommands.resume) {
      this.resumeCleaning();
    }
  },

  startHouseCleaning: function() {
    this.robot.startCleaning({
      category: 2,
      mode: 1,
      modifier: 1
    });
  },

  pauseCleaning: function() {
    this.robot.pauseCleaning();
  },

  resumeCleaning: function() {
    this.robot.resumeCleaning();
  },

  stopCleaning: function() {
    this.robot.stopCleaning();
  },

  sendToBase: function() {
    this.robot.sendToBase();
  }
};

$(function() {
  NeatoDemoApp.initialize();
});