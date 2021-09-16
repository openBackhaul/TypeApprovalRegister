'use strict';


/**
 * Returns entire data tree
 *
 * returns inline_response_200_8
 **/
exports.getControlConstruct = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = {
  "core-model-1-4:control-construct" : {
    "profile-collection" : {
      "profile" : [ {
        "uuid" : "tar-0-0-1-application-p-0000",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "RegistryOffice",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-0001",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "TypeApprovalRegister",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-0002",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "ExecutionAndTraceLog",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-0003",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "OamLog",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-1000",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "CurrentController",
            "release-number" : "0.0.6"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_APPROVED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-1001",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "Resolver",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_REGISTERED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-1002",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "Connector2LtpUuid",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_REGISTERED"
          }
        }
      }, {
        "uuid" : "tar-0-0-1-application-p-9999",
        "profile-name" : "application-profile-1-0:PROFILE_NAME_TYPE_APPLICATION_PROFILE",
        "application-profile-1-0:application-profile-pac" : {
          "application-profile-capability" : {
            "application-name" : "BadApplication",
            "release-number" : "0.0.1"
          },
          "application-profile-configuration" : {
            "approval-status" : "application-profile-1-0:APPROVAL_STATUS_TYPE_BARRED"
          }
        }
      } ]
    },
    "logical-termination-point" : [ {
      "uuid" : "tar-0-0-1-op-s-0000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/register-yourself"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-0001",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/embed-yourself"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-0002",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/notify-service-requests"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-0003",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/notify-oam-requests"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-0004",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/end-subscription"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-2000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/start-application-in-generic-representation"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "n.a."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-2001",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/inform-about-application"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "n.a."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-2002",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/inform-about-application-in-generic-representation"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "n.a."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-2003",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/inform-about-release-history"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "n.a."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-2004",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/inform-about-release-history-in-generic-representation"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "n.a."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-3000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/regard-application"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-3001",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/disregard-application"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-3002",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/document-approval-status"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-3003",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/list-applications"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-3004",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/list-approved-applications-in-generic-representation"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-s-3005",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-server-interface-1-0:operation-server-interface-pac" : {
          "operation-server-interface-capability" : {
            "operation-name" : "/v1/notify-documentation-of-an-approval-status"
          },
          "operation-server-interface-configuration" : {
            "life-cycle-state" : "operation-server-interface-1-0:LIFE_CYCLE_STATE_TYPE_EXPERIMENTAL",
            "operation-key" : "Operation key not yet provided."
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-http-s-0000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ "tar-0-0-1-op-s-3000", "tar-0-0-1-op-s-3001" ],
      "server-ltp" : [ "tar-0-0-1-tcp-s-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "http-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-server-interface-1-0:http-server-interface-pac" : {
          "http-server-interface-capability" : {
            "application-name" : "TypeApprovalRegister",
            "release-number" : "0.0.1",
            "application-purpose" : "Type approvals for applications being active in the MBH SDN must be documented here.",
            "data-update-period" : "http-server-interface-1-0:DATA_UPDATE_PERIOD_TYPE_REAL_TIME",
            "owner-name" : "Thorsten Heinze",
            "owner-email-address" : "Thorsten.Heinze@telefonica.com",
            "release-list" : [ {
              "release-number" : "0.0.1",
              "release-date" : "16.07.2021",
              "changes" : "Initial version."
            } ]
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-tcp-s-0000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SOURCE",
      "client-ltp" : [ "tar-0-0-1-http-s-0000" ],
      "server-ltp" : [ ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "tcp-server-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        "tcp-server-interface-1-0:tcp-server-interface-pac" : {
          "tcp-server-interface-configuration" : {
            "local-address" : {
              "ipv-4-address" : "10.118.125.157"
            },
            "local-port" : 1001
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-0000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/register-application",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-3000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/notify-registrations",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-3001",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/notify-deregistrations",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-3002",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/update-approval-status",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-3003",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/end-subscription",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-http-c-0000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-op-c-0000", "tar-0-0-1-op-c-3000" ],
      "server-ltp" : [ "tar-0-0-1-tcp-c-0000" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-client-interface-1-0:http-client-interface-pac" : {
          "http-client-interface-capability" : {
            "application-name" : "RegistryOffice"
          },
          "http-client-interface-configuration" : {
            "release-number" : "0.0.1"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-tcp-c-0000",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-http-c-0000" ],
      "server-ltp" : [ ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        "tcp-client-interface-1-0:tcp-client-interface-pac" : {
          "tcp-client-interface-configuration" : {
            "remote-address" : {
              "ip-address" : {
                "ipv-4-address" : "10.118.125.157",
                "ipv-6-address" : "0:0:0:0:0:0:0:0"
              },
              "domain-name" : "Not yet defined."
            },
            "remote-port" : 1000
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-0020",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0020" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/record-service-request",
            "operation-key" : "Operation key not yet provided.",
            "detailed-logging-is-on" : "false"
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-http-c-0020",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-op-c-0020" ],
      "server-ltp" : [ "tar-0-0-1-tcp-c-0020" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-client-interface-1-0:http-client-interface-pac" : {
          "http-client-interface-capability" : {
            "application-name" : "ExecutionAndTraceLog"
          },
          "http-client-interface-configuration" : {
            "release-number" : "0.0.1"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-tcp-c-0020",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-http-c-0020" ],
      "server-ltp" : [ ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        "tcp-client-interface-1-0:tcp-client-interface-pac" : {
          "tcp-client-interface-configuration" : {
            "remote-address" : {
              "ip-address" : {
                "ipv-4-address" : "10.118.125.157",
                "ipv-6-address" : "0:0:0:0:0:0:0:0"
              },
              "domain-name" : "Not yet defined."
            },
            "remote-port" : 1002
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-0030",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0030" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/record-oam-request",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-http-c-0030",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-op-c-0030" ],
      "server-ltp" : [ "tar-0-0-1-tcp-c-0030" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-client-interface-1-0:http-client-interface-pac" : {
          "http-client-interface-capability" : {
            "application-name" : "OamLog"
          },
          "http-client-interface-configuration" : {
            "release-number" : "0.0.1"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-tcp-c-0030",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-http-c-0030" ],
      "server-ltp" : [ ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        "tcp-client-interface-1-0:tcp-client-interface-pac" : {
          "tcp-client-interface-configuration" : {
            "remote-address" : {
              "ip-address" : {
                "ipv-4-address" : "10.118.125.157",
                "ipv-6-address" : "0:0:0:0:0:0:0:0"
              },
              "domain-name" : "Not yet defined."
            },
            "remote-port" : 1003
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-op-c-0040",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ ],
      "server-ltp" : [ "tar-0-0-1-http-c-0040" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "operation-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_OPERATION_LAYER",
        "operation-client-interface-1-0:operation-client-interface-pac" : {
          "operation-client-interface-configuration" : {
            "operation-name" : "/v1/approve-oam-request",
            "operation-key" : "Operation key not yet provided."
          },
          "operation-client-interface-status" : {
            "operational-state" : "operation-client-interface-1-0:OPERATIONAL_STATE_TYPE_NOT_YET_DEFINED",
            "life-cycle-state" : "operation-client-interface-1-0:LIFE_CYCLE_STATE_TYPE_NOT_YET_DEFINED"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-http-c-0040",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-op-c-0040" ],
      "server-ltp" : [ "tar-0-0-1-tcp-c-0040" ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "http-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_HTTP_LAYER",
        "http-client-interface-1-0:http-client-interface-pac" : {
          "http-client-interface-capability" : {
            "application-name" : "AdministratorAdministration"
          },
          "http-client-interface-configuration" : {
            "release-number" : "0.0.1"
          }
        }
      } ]
    }, {
      "uuid" : "tar-0-0-1-tcp-c-0040",
      "ltp-direction" : "core-model-1-4:TERMINATION_DIRECTION_SINK",
      "client-ltp" : [ "tar-0-0-1-http-c-0040" ],
      "server-ltp" : [ ],
      "layer-protocol" : [ {
        "local-id" : "0",
        "layer-protocol-name" : "tcp-client-interface-1-0:LAYER_PROTOCOL_NAME_TYPE_TCP_LAYER",
        "tcp-client-interface-1-0:tcp-client-interface-pac" : {
          "tcp-client-interface-configuration" : {
            "remote-address" : {
              "ip-address" : {
                "ipv-4-address" : "10.118.125.157",
                "ipv-6-address" : "0:0:0:0:0:0:0:0"
              },
              "domain-name" : "Not yet defined."
            },
            "remote-port" : 1004
          }
        }
      } ]
    } ]
  }
};
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

