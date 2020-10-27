FORMAT: 1A

# Group Polymerization

## Endpoint [/config]

### Scan Configuration [POST]

#### About

* configure scan settings

+ Request (application/json)

    + Attributes
        + pinConfigs (array, required)
            + (object)
                + name: pinName (string, required)
                + value: 0 (number, required)
        + size: 1000 (number, required) - length of scan square u32sm
        + speed: 1 (number, required) - send pulse every X millisecond u32sm
        + shape: 0 (number, required) - 0: E shape 1: F shape u32sm
        + invert: 1 (number, required) - 0:not inverted pulse 1: inverted pulse u32sm

+ Response 200 (application/json)

    + Attributes

        + accessToken: f58ba22059f5a8aa8f346e0f40987adab326041fac99029c909bef2c6300821a (string, required) - アクセストークン
