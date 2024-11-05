import {
    scenario,
    simulation,
    constantUsersPerSec,
    rampUsers
} from "@gatling.io/core";
import { http } from "@gatling.io/http";

export default simulation((setUp) => {

    const httpProtocol = http
        .baseUrl("https://api.clickup.com/api/v2")
        .acceptHeader("application/json")
        .contentTypeHeader("application/json")
        .header("Authorization", "pk_2144410100_UHSIC7AK5SLLZTOD067P1TI0QIXO1YGD");


    const getUser = scenario("Get Authorized User")
        .exec(http("get user").get("/user"));

    setUp(
        getUser.injectOpen(
            // Навантаження 20 users/sec протягом 20 sec,
            constantUsersPerSec(20).during(20),
            // потім ramp up навантаження 100 users/sec на 30 sec
            rampUsers(100).during(30)
        )
    ).protocols(httpProtocol);
});