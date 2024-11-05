import {
    scenario,
    simulation,
    constantUsersPerSec,
    stressPeakUsers,
    rampUsers,
    atOnceUsers,
    nothingFor
} from "@gatling.io/core";
import { http } from "@gatling.io/http";

export default simulation((setUp) => {

    const httpProtocol = http
        .baseUrl("https://api.clickup.com/api/v2")
       // .acceptHeader("application/json")
        .contentTypeHeader("application/json")
        .header("Authorization", "pk_152602109_FOIQ1MNPZPNS69LWUGZX62M5WKX8SVJ3");


    const getTask = scenario("Get Task by ID")
        .exec(http("get task").get("/task/8696fz718"));

    setUp(
        getTask.injectOpen(
            nothingFor(3),
            atOnceUsers(25),
            rampUsers(10).during(5),
            stressPeakUsers(60).during(5),
            nothingFor(2),
            atOnceUsers(15),
            constantUsersPerSec(5).during(5)
        )
    ).protocols(httpProtocol);
});