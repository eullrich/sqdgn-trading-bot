
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Call
 * 
 */
export type Call = $Result.DefaultSelection<Prisma.$CallPayload>
/**
 * Model TokenPriceSnapshot
 * 
 */
export type TokenPriceSnapshot = $Result.DefaultSelection<Prisma.$TokenPriceSnapshotPayload>
/**
 * Model TradingPosition
 * 
 */
export type TradingPosition = $Result.DefaultSelection<Prisma.$TradingPositionPayload>
/**
 * Model TrailingStop
 * 
 */
export type TrailingStop = $Result.DefaultSelection<Prisma.$TrailingStopPayload>
/**
 * Model UserTradingConfig
 * 
 */
export type UserTradingConfig = $Result.DefaultSelection<Prisma.$UserTradingConfigPayload>
/**
 * Model AutoBuyQueue
 * 
 */
export type AutoBuyQueue = $Result.DefaultSelection<Prisma.$AutoBuyQueuePayload>
/**
 * Model TradeHistory
 * 
 */
export type TradeHistory = $Result.DefaultSelection<Prisma.$TradeHistoryPayload>
/**
 * Model PriceAlert
 * 
 */
export type PriceAlert = $Result.DefaultSelection<Prisma.$PriceAlertPayload>
/**
 * Model AuditLog
 * 
 */
export type AuditLog = $Result.DefaultSelection<Prisma.$AuditLogPayload>
/**
 * Model IngestionRun
 * 
 */
export type IngestionRun = $Result.DefaultSelection<Prisma.$IngestionRunPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Calls
 * const calls = await prisma.call.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Calls
   * const calls = await prisma.call.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.call`: Exposes CRUD operations for the **Call** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Calls
    * const calls = await prisma.call.findMany()
    * ```
    */
  get call(): Prisma.CallDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tokenPriceSnapshot`: Exposes CRUD operations for the **TokenPriceSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TokenPriceSnapshots
    * const tokenPriceSnapshots = await prisma.tokenPriceSnapshot.findMany()
    * ```
    */
  get tokenPriceSnapshot(): Prisma.TokenPriceSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradingPosition`: Exposes CRUD operations for the **TradingPosition** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradingPositions
    * const tradingPositions = await prisma.tradingPosition.findMany()
    * ```
    */
  get tradingPosition(): Prisma.TradingPositionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.trailingStop`: Exposes CRUD operations for the **TrailingStop** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TrailingStops
    * const trailingStops = await prisma.trailingStop.findMany()
    * ```
    */
  get trailingStop(): Prisma.TrailingStopDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userTradingConfig`: Exposes CRUD operations for the **UserTradingConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserTradingConfigs
    * const userTradingConfigs = await prisma.userTradingConfig.findMany()
    * ```
    */
  get userTradingConfig(): Prisma.UserTradingConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.autoBuyQueue`: Exposes CRUD operations for the **AutoBuyQueue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AutoBuyQueues
    * const autoBuyQueues = await prisma.autoBuyQueue.findMany()
    * ```
    */
  get autoBuyQueue(): Prisma.AutoBuyQueueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.tradeHistory`: Exposes CRUD operations for the **TradeHistory** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TradeHistories
    * const tradeHistories = await prisma.tradeHistory.findMany()
    * ```
    */
  get tradeHistory(): Prisma.TradeHistoryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.priceAlert`: Exposes CRUD operations for the **PriceAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PriceAlerts
    * const priceAlerts = await prisma.priceAlert.findMany()
    * ```
    */
  get priceAlert(): Prisma.PriceAlertDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auditLog`: Exposes CRUD operations for the **AuditLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AuditLogs
    * const auditLogs = await prisma.auditLog.findMany()
    * ```
    */
  get auditLog(): Prisma.AuditLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ingestionRun`: Exposes CRUD operations for the **IngestionRun** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more IngestionRuns
    * const ingestionRuns = await prisma.ingestionRun.findMany()
    * ```
    */
  get ingestionRun(): Prisma.IngestionRunDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.1
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Call: 'Call',
    TokenPriceSnapshot: 'TokenPriceSnapshot',
    TradingPosition: 'TradingPosition',
    TrailingStop: 'TrailingStop',
    UserTradingConfig: 'UserTradingConfig',
    AutoBuyQueue: 'AutoBuyQueue',
    TradeHistory: 'TradeHistory',
    PriceAlert: 'PriceAlert',
    AuditLog: 'AuditLog',
    IngestionRun: 'IngestionRun'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "call" | "tokenPriceSnapshot" | "tradingPosition" | "trailingStop" | "userTradingConfig" | "autoBuyQueue" | "tradeHistory" | "priceAlert" | "auditLog" | "ingestionRun"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Call: {
        payload: Prisma.$CallPayload<ExtArgs>
        fields: Prisma.CallFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CallFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CallFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          findFirst: {
            args: Prisma.CallFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CallFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          findMany: {
            args: Prisma.CallFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          create: {
            args: Prisma.CallCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          createMany: {
            args: Prisma.CallCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CallCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          delete: {
            args: Prisma.CallDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          update: {
            args: Prisma.CallUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          deleteMany: {
            args: Prisma.CallDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CallUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CallUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>[]
          }
          upsert: {
            args: Prisma.CallUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CallPayload>
          }
          aggregate: {
            args: Prisma.CallAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCall>
          }
          groupBy: {
            args: Prisma.CallGroupByArgs<ExtArgs>
            result: $Utils.Optional<CallGroupByOutputType>[]
          }
          count: {
            args: Prisma.CallCountArgs<ExtArgs>
            result: $Utils.Optional<CallCountAggregateOutputType> | number
          }
        }
      }
      TokenPriceSnapshot: {
        payload: Prisma.$TokenPriceSnapshotPayload<ExtArgs>
        fields: Prisma.TokenPriceSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TokenPriceSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TokenPriceSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>
          }
          findFirst: {
            args: Prisma.TokenPriceSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TokenPriceSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>
          }
          findMany: {
            args: Prisma.TokenPriceSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>[]
          }
          create: {
            args: Prisma.TokenPriceSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>
          }
          createMany: {
            args: Prisma.TokenPriceSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TokenPriceSnapshotCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>[]
          }
          delete: {
            args: Prisma.TokenPriceSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>
          }
          update: {
            args: Prisma.TokenPriceSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.TokenPriceSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TokenPriceSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TokenPriceSnapshotUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>[]
          }
          upsert: {
            args: Prisma.TokenPriceSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TokenPriceSnapshotPayload>
          }
          aggregate: {
            args: Prisma.TokenPriceSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTokenPriceSnapshot>
          }
          groupBy: {
            args: Prisma.TokenPriceSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<TokenPriceSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.TokenPriceSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<TokenPriceSnapshotCountAggregateOutputType> | number
          }
        }
      }
      TradingPosition: {
        payload: Prisma.$TradingPositionPayload<ExtArgs>
        fields: Prisma.TradingPositionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradingPositionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradingPositionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          findFirst: {
            args: Prisma.TradingPositionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradingPositionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          findMany: {
            args: Prisma.TradingPositionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>[]
          }
          create: {
            args: Prisma.TradingPositionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          createMany: {
            args: Prisma.TradingPositionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradingPositionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>[]
          }
          delete: {
            args: Prisma.TradingPositionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          update: {
            args: Prisma.TradingPositionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          deleteMany: {
            args: Prisma.TradingPositionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradingPositionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradingPositionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>[]
          }
          upsert: {
            args: Prisma.TradingPositionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradingPositionPayload>
          }
          aggregate: {
            args: Prisma.TradingPositionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradingPosition>
          }
          groupBy: {
            args: Prisma.TradingPositionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradingPositionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradingPositionCountArgs<ExtArgs>
            result: $Utils.Optional<TradingPositionCountAggregateOutputType> | number
          }
        }
      }
      TrailingStop: {
        payload: Prisma.$TrailingStopPayload<ExtArgs>
        fields: Prisma.TrailingStopFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TrailingStopFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TrailingStopFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>
          }
          findFirst: {
            args: Prisma.TrailingStopFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TrailingStopFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>
          }
          findMany: {
            args: Prisma.TrailingStopFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>[]
          }
          create: {
            args: Prisma.TrailingStopCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>
          }
          createMany: {
            args: Prisma.TrailingStopCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TrailingStopCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>[]
          }
          delete: {
            args: Prisma.TrailingStopDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>
          }
          update: {
            args: Prisma.TrailingStopUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>
          }
          deleteMany: {
            args: Prisma.TrailingStopDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TrailingStopUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TrailingStopUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>[]
          }
          upsert: {
            args: Prisma.TrailingStopUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TrailingStopPayload>
          }
          aggregate: {
            args: Prisma.TrailingStopAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTrailingStop>
          }
          groupBy: {
            args: Prisma.TrailingStopGroupByArgs<ExtArgs>
            result: $Utils.Optional<TrailingStopGroupByOutputType>[]
          }
          count: {
            args: Prisma.TrailingStopCountArgs<ExtArgs>
            result: $Utils.Optional<TrailingStopCountAggregateOutputType> | number
          }
        }
      }
      UserTradingConfig: {
        payload: Prisma.$UserTradingConfigPayload<ExtArgs>
        fields: Prisma.UserTradingConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserTradingConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserTradingConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>
          }
          findFirst: {
            args: Prisma.UserTradingConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserTradingConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>
          }
          findMany: {
            args: Prisma.UserTradingConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>[]
          }
          create: {
            args: Prisma.UserTradingConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>
          }
          createMany: {
            args: Prisma.UserTradingConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserTradingConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>[]
          }
          delete: {
            args: Prisma.UserTradingConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>
          }
          update: {
            args: Prisma.UserTradingConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>
          }
          deleteMany: {
            args: Prisma.UserTradingConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserTradingConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserTradingConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>[]
          }
          upsert: {
            args: Prisma.UserTradingConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserTradingConfigPayload>
          }
          aggregate: {
            args: Prisma.UserTradingConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserTradingConfig>
          }
          groupBy: {
            args: Prisma.UserTradingConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserTradingConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserTradingConfigCountArgs<ExtArgs>
            result: $Utils.Optional<UserTradingConfigCountAggregateOutputType> | number
          }
        }
      }
      AutoBuyQueue: {
        payload: Prisma.$AutoBuyQueuePayload<ExtArgs>
        fields: Prisma.AutoBuyQueueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AutoBuyQueueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AutoBuyQueueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>
          }
          findFirst: {
            args: Prisma.AutoBuyQueueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AutoBuyQueueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>
          }
          findMany: {
            args: Prisma.AutoBuyQueueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>[]
          }
          create: {
            args: Prisma.AutoBuyQueueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>
          }
          createMany: {
            args: Prisma.AutoBuyQueueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AutoBuyQueueCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>[]
          }
          delete: {
            args: Prisma.AutoBuyQueueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>
          }
          update: {
            args: Prisma.AutoBuyQueueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>
          }
          deleteMany: {
            args: Prisma.AutoBuyQueueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AutoBuyQueueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AutoBuyQueueUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>[]
          }
          upsert: {
            args: Prisma.AutoBuyQueueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AutoBuyQueuePayload>
          }
          aggregate: {
            args: Prisma.AutoBuyQueueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAutoBuyQueue>
          }
          groupBy: {
            args: Prisma.AutoBuyQueueGroupByArgs<ExtArgs>
            result: $Utils.Optional<AutoBuyQueueGroupByOutputType>[]
          }
          count: {
            args: Prisma.AutoBuyQueueCountArgs<ExtArgs>
            result: $Utils.Optional<AutoBuyQueueCountAggregateOutputType> | number
          }
        }
      }
      TradeHistory: {
        payload: Prisma.$TradeHistoryPayload<ExtArgs>
        fields: Prisma.TradeHistoryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TradeHistoryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TradeHistoryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>
          }
          findFirst: {
            args: Prisma.TradeHistoryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TradeHistoryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>
          }
          findMany: {
            args: Prisma.TradeHistoryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>[]
          }
          create: {
            args: Prisma.TradeHistoryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>
          }
          createMany: {
            args: Prisma.TradeHistoryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TradeHistoryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>[]
          }
          delete: {
            args: Prisma.TradeHistoryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>
          }
          update: {
            args: Prisma.TradeHistoryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>
          }
          deleteMany: {
            args: Prisma.TradeHistoryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TradeHistoryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TradeHistoryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>[]
          }
          upsert: {
            args: Prisma.TradeHistoryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TradeHistoryPayload>
          }
          aggregate: {
            args: Prisma.TradeHistoryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTradeHistory>
          }
          groupBy: {
            args: Prisma.TradeHistoryGroupByArgs<ExtArgs>
            result: $Utils.Optional<TradeHistoryGroupByOutputType>[]
          }
          count: {
            args: Prisma.TradeHistoryCountArgs<ExtArgs>
            result: $Utils.Optional<TradeHistoryCountAggregateOutputType> | number
          }
        }
      }
      PriceAlert: {
        payload: Prisma.$PriceAlertPayload<ExtArgs>
        fields: Prisma.PriceAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PriceAlertFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PriceAlertFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>
          }
          findFirst: {
            args: Prisma.PriceAlertFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PriceAlertFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>
          }
          findMany: {
            args: Prisma.PriceAlertFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>[]
          }
          create: {
            args: Prisma.PriceAlertCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>
          }
          createMany: {
            args: Prisma.PriceAlertCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PriceAlertCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>[]
          }
          delete: {
            args: Prisma.PriceAlertDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>
          }
          update: {
            args: Prisma.PriceAlertUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>
          }
          deleteMany: {
            args: Prisma.PriceAlertDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PriceAlertUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PriceAlertUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>[]
          }
          upsert: {
            args: Prisma.PriceAlertUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PriceAlertPayload>
          }
          aggregate: {
            args: Prisma.PriceAlertAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePriceAlert>
          }
          groupBy: {
            args: Prisma.PriceAlertGroupByArgs<ExtArgs>
            result: $Utils.Optional<PriceAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.PriceAlertCountArgs<ExtArgs>
            result: $Utils.Optional<PriceAlertCountAggregateOutputType> | number
          }
        }
      }
      AuditLog: {
        payload: Prisma.$AuditLogPayload<ExtArgs>
        fields: Prisma.AuditLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AuditLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AuditLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findFirst: {
            args: Prisma.AuditLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AuditLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          findMany: {
            args: Prisma.AuditLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          create: {
            args: Prisma.AuditLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          createMany: {
            args: Prisma.AuditLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AuditLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          delete: {
            args: Prisma.AuditLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          update: {
            args: Prisma.AuditLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          deleteMany: {
            args: Prisma.AuditLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AuditLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AuditLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>[]
          }
          upsert: {
            args: Prisma.AuditLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AuditLogPayload>
          }
          aggregate: {
            args: Prisma.AuditLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuditLog>
          }
          groupBy: {
            args: Prisma.AuditLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AuditLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AuditLogCountArgs<ExtArgs>
            result: $Utils.Optional<AuditLogCountAggregateOutputType> | number
          }
        }
      }
      IngestionRun: {
        payload: Prisma.$IngestionRunPayload<ExtArgs>
        fields: Prisma.IngestionRunFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IngestionRunFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IngestionRunFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          findFirst: {
            args: Prisma.IngestionRunFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IngestionRunFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          findMany: {
            args: Prisma.IngestionRunFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>[]
          }
          create: {
            args: Prisma.IngestionRunCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          createMany: {
            args: Prisma.IngestionRunCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.IngestionRunCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>[]
          }
          delete: {
            args: Prisma.IngestionRunDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          update: {
            args: Prisma.IngestionRunUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          deleteMany: {
            args: Prisma.IngestionRunDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IngestionRunUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.IngestionRunUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>[]
          }
          upsert: {
            args: Prisma.IngestionRunUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IngestionRunPayload>
          }
          aggregate: {
            args: Prisma.IngestionRunAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIngestionRun>
          }
          groupBy: {
            args: Prisma.IngestionRunGroupByArgs<ExtArgs>
            result: $Utils.Optional<IngestionRunGroupByOutputType>[]
          }
          count: {
            args: Prisma.IngestionRunCountArgs<ExtArgs>
            result: $Utils.Optional<IngestionRunCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    call?: CallOmit
    tokenPriceSnapshot?: TokenPriceSnapshotOmit
    tradingPosition?: TradingPositionOmit
    trailingStop?: TrailingStopOmit
    userTradingConfig?: UserTradingConfigOmit
    autoBuyQueue?: AutoBuyQueueOmit
    tradeHistory?: TradeHistoryOmit
    priceAlert?: PriceAlertOmit
    auditLog?: AuditLogOmit
    ingestionRun?: IngestionRunOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type CallCountOutputType
   */

  export type CallCountOutputType = {
    tradingPositions: number
    autoBuyQueue: number
  }

  export type CallCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tradingPositions?: boolean | CallCountOutputTypeCountTradingPositionsArgs
    autoBuyQueue?: boolean | CallCountOutputTypeCountAutoBuyQueueArgs
  }

  // Custom InputTypes
  /**
   * CallCountOutputType without action
   */
  export type CallCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CallCountOutputType
     */
    select?: CallCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * CallCountOutputType without action
   */
  export type CallCountOutputTypeCountTradingPositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingPositionWhereInput
  }

  /**
   * CallCountOutputType without action
   */
  export type CallCountOutputTypeCountAutoBuyQueueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AutoBuyQueueWhereInput
  }


  /**
   * Count Type TradingPositionCountOutputType
   */

  export type TradingPositionCountOutputType = {
    trailingStops: number
    tradeHistory: number
    priceAlerts: number
  }

  export type TradingPositionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    trailingStops?: boolean | TradingPositionCountOutputTypeCountTrailingStopsArgs
    tradeHistory?: boolean | TradingPositionCountOutputTypeCountTradeHistoryArgs
    priceAlerts?: boolean | TradingPositionCountOutputTypeCountPriceAlertsArgs
  }

  // Custom InputTypes
  /**
   * TradingPositionCountOutputType without action
   */
  export type TradingPositionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPositionCountOutputType
     */
    select?: TradingPositionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradingPositionCountOutputType without action
   */
  export type TradingPositionCountOutputTypeCountTrailingStopsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrailingStopWhereInput
  }

  /**
   * TradingPositionCountOutputType without action
   */
  export type TradingPositionCountOutputTypeCountTradeHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeHistoryWhereInput
  }

  /**
   * TradingPositionCountOutputType without action
   */
  export type TradingPositionCountOutputTypeCountPriceAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceAlertWhereInput
  }


  /**
   * Count Type TradeHistoryCountOutputType
   */

  export type TradeHistoryCountOutputType = {
    autoBuyQueue: number
  }

  export type TradeHistoryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    autoBuyQueue?: boolean | TradeHistoryCountOutputTypeCountAutoBuyQueueArgs
  }

  // Custom InputTypes
  /**
   * TradeHistoryCountOutputType without action
   */
  export type TradeHistoryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistoryCountOutputType
     */
    select?: TradeHistoryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TradeHistoryCountOutputType without action
   */
  export type TradeHistoryCountOutputTypeCountAutoBuyQueueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AutoBuyQueueWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Call
   */

  export type AggregateCall = {
    _count: CallCountAggregateOutputType | null
    _avg: CallAvgAggregateOutputType | null
    _sum: CallSumAggregateOutputType | null
    _min: CallMinAggregateOutputType | null
    _max: CallMaxAggregateOutputType | null
  }

  export type CallAvgAggregateOutputType = {
    marketCap: Decimal | null
    liquidity: Decimal | null
    volume24h: Decimal | null
    currentPriceUsd: Decimal | null
    currentMarketCap: Decimal | null
  }

  export type CallSumAggregateOutputType = {
    marketCap: Decimal | null
    liquidity: Decimal | null
    volume24h: Decimal | null
    currentPriceUsd: Decimal | null
    currentMarketCap: Decimal | null
  }

  export type CallMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    messageId: string | null
    rawMessage: string | null
    messageTimestamp: Date | null
    tokenSymbol: string | null
    tokenName: string | null
    contractAddress: string | null
    blockchain: string | null
    sqdgnLabel: string | null
    callType: string | null
    marketCap: Decimal | null
    liquidity: Decimal | null
    volume24h: Decimal | null
    currentPriceUsd: Decimal | null
    priceUpdatedAt: Date | null
    currentMarketCap: Decimal | null
    marketCapUpdatedAt: Date | null
    dexScreenerUrl: string | null
    jupiterUrl: string | null
    raydiumUrl: string | null
    isValid: boolean | null
    parsedAt: Date | null
  }

  export type CallMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    messageId: string | null
    rawMessage: string | null
    messageTimestamp: Date | null
    tokenSymbol: string | null
    tokenName: string | null
    contractAddress: string | null
    blockchain: string | null
    sqdgnLabel: string | null
    callType: string | null
    marketCap: Decimal | null
    liquidity: Decimal | null
    volume24h: Decimal | null
    currentPriceUsd: Decimal | null
    priceUpdatedAt: Date | null
    currentMarketCap: Decimal | null
    marketCapUpdatedAt: Date | null
    dexScreenerUrl: string | null
    jupiterUrl: string | null
    raydiumUrl: string | null
    isValid: boolean | null
    parsedAt: Date | null
  }

  export type CallCountAggregateOutputType = {
    id: number
    createdAt: number
    messageId: number
    rawMessage: number
    messageTimestamp: number
    tokenSymbol: number
    tokenName: number
    contractAddress: number
    blockchain: number
    sqdgnLabel: number
    callType: number
    marketCap: number
    liquidity: number
    volume24h: number
    currentPriceUsd: number
    priceUpdatedAt: number
    currentMarketCap: number
    marketCapUpdatedAt: number
    dexScreenerUrl: number
    jupiterUrl: number
    raydiumUrl: number
    metadata: number
    isValid: number
    parsedAt: number
    _all: number
  }


  export type CallAvgAggregateInputType = {
    marketCap?: true
    liquidity?: true
    volume24h?: true
    currentPriceUsd?: true
    currentMarketCap?: true
  }

  export type CallSumAggregateInputType = {
    marketCap?: true
    liquidity?: true
    volume24h?: true
    currentPriceUsd?: true
    currentMarketCap?: true
  }

  export type CallMinAggregateInputType = {
    id?: true
    createdAt?: true
    messageId?: true
    rawMessage?: true
    messageTimestamp?: true
    tokenSymbol?: true
    tokenName?: true
    contractAddress?: true
    blockchain?: true
    sqdgnLabel?: true
    callType?: true
    marketCap?: true
    liquidity?: true
    volume24h?: true
    currentPriceUsd?: true
    priceUpdatedAt?: true
    currentMarketCap?: true
    marketCapUpdatedAt?: true
    dexScreenerUrl?: true
    jupiterUrl?: true
    raydiumUrl?: true
    isValid?: true
    parsedAt?: true
  }

  export type CallMaxAggregateInputType = {
    id?: true
    createdAt?: true
    messageId?: true
    rawMessage?: true
    messageTimestamp?: true
    tokenSymbol?: true
    tokenName?: true
    contractAddress?: true
    blockchain?: true
    sqdgnLabel?: true
    callType?: true
    marketCap?: true
    liquidity?: true
    volume24h?: true
    currentPriceUsd?: true
    priceUpdatedAt?: true
    currentMarketCap?: true
    marketCapUpdatedAt?: true
    dexScreenerUrl?: true
    jupiterUrl?: true
    raydiumUrl?: true
    isValid?: true
    parsedAt?: true
  }

  export type CallCountAggregateInputType = {
    id?: true
    createdAt?: true
    messageId?: true
    rawMessage?: true
    messageTimestamp?: true
    tokenSymbol?: true
    tokenName?: true
    contractAddress?: true
    blockchain?: true
    sqdgnLabel?: true
    callType?: true
    marketCap?: true
    liquidity?: true
    volume24h?: true
    currentPriceUsd?: true
    priceUpdatedAt?: true
    currentMarketCap?: true
    marketCapUpdatedAt?: true
    dexScreenerUrl?: true
    jupiterUrl?: true
    raydiumUrl?: true
    metadata?: true
    isValid?: true
    parsedAt?: true
    _all?: true
  }

  export type CallAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Call to aggregate.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Calls
    **/
    _count?: true | CallCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CallAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CallSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CallMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CallMaxAggregateInputType
  }

  export type GetCallAggregateType<T extends CallAggregateArgs> = {
        [P in keyof T & keyof AggregateCall]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCall[P]>
      : GetScalarType<T[P], AggregateCall[P]>
  }




  export type CallGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CallWhereInput
    orderBy?: CallOrderByWithAggregationInput | CallOrderByWithAggregationInput[]
    by: CallScalarFieldEnum[] | CallScalarFieldEnum
    having?: CallScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CallCountAggregateInputType | true
    _avg?: CallAvgAggregateInputType
    _sum?: CallSumAggregateInputType
    _min?: CallMinAggregateInputType
    _max?: CallMaxAggregateInputType
  }

  export type CallGroupByOutputType = {
    id: string
    createdAt: Date
    messageId: string
    rawMessage: string
    messageTimestamp: Date | null
    tokenSymbol: string | null
    tokenName: string | null
    contractAddress: string | null
    blockchain: string | null
    sqdgnLabel: string | null
    callType: string | null
    marketCap: Decimal | null
    liquidity: Decimal | null
    volume24h: Decimal | null
    currentPriceUsd: Decimal | null
    priceUpdatedAt: Date | null
    currentMarketCap: Decimal | null
    marketCapUpdatedAt: Date | null
    dexScreenerUrl: string | null
    jupiterUrl: string | null
    raydiumUrl: string | null
    metadata: JsonValue | null
    isValid: boolean
    parsedAt: Date
    _count: CallCountAggregateOutputType | null
    _avg: CallAvgAggregateOutputType | null
    _sum: CallSumAggregateOutputType | null
    _min: CallMinAggregateOutputType | null
    _max: CallMaxAggregateOutputType | null
  }

  type GetCallGroupByPayload<T extends CallGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CallGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CallGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CallGroupByOutputType[P]>
            : GetScalarType<T[P], CallGroupByOutputType[P]>
        }
      >
    >


  export type CallSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    messageId?: boolean
    rawMessage?: boolean
    messageTimestamp?: boolean
    tokenSymbol?: boolean
    tokenName?: boolean
    contractAddress?: boolean
    blockchain?: boolean
    sqdgnLabel?: boolean
    callType?: boolean
    marketCap?: boolean
    liquidity?: boolean
    volume24h?: boolean
    currentPriceUsd?: boolean
    priceUpdatedAt?: boolean
    currentMarketCap?: boolean
    marketCapUpdatedAt?: boolean
    dexScreenerUrl?: boolean
    jupiterUrl?: boolean
    raydiumUrl?: boolean
    metadata?: boolean
    isValid?: boolean
    parsedAt?: boolean
    tradingPositions?: boolean | Call$tradingPositionsArgs<ExtArgs>
    autoBuyQueue?: boolean | Call$autoBuyQueueArgs<ExtArgs>
    _count?: boolean | CallCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["call"]>

  export type CallSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    messageId?: boolean
    rawMessage?: boolean
    messageTimestamp?: boolean
    tokenSymbol?: boolean
    tokenName?: boolean
    contractAddress?: boolean
    blockchain?: boolean
    sqdgnLabel?: boolean
    callType?: boolean
    marketCap?: boolean
    liquidity?: boolean
    volume24h?: boolean
    currentPriceUsd?: boolean
    priceUpdatedAt?: boolean
    currentMarketCap?: boolean
    marketCapUpdatedAt?: boolean
    dexScreenerUrl?: boolean
    jupiterUrl?: boolean
    raydiumUrl?: boolean
    metadata?: boolean
    isValid?: boolean
    parsedAt?: boolean
  }, ExtArgs["result"]["call"]>

  export type CallSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    messageId?: boolean
    rawMessage?: boolean
    messageTimestamp?: boolean
    tokenSymbol?: boolean
    tokenName?: boolean
    contractAddress?: boolean
    blockchain?: boolean
    sqdgnLabel?: boolean
    callType?: boolean
    marketCap?: boolean
    liquidity?: boolean
    volume24h?: boolean
    currentPriceUsd?: boolean
    priceUpdatedAt?: boolean
    currentMarketCap?: boolean
    marketCapUpdatedAt?: boolean
    dexScreenerUrl?: boolean
    jupiterUrl?: boolean
    raydiumUrl?: boolean
    metadata?: boolean
    isValid?: boolean
    parsedAt?: boolean
  }, ExtArgs["result"]["call"]>

  export type CallSelectScalar = {
    id?: boolean
    createdAt?: boolean
    messageId?: boolean
    rawMessage?: boolean
    messageTimestamp?: boolean
    tokenSymbol?: boolean
    tokenName?: boolean
    contractAddress?: boolean
    blockchain?: boolean
    sqdgnLabel?: boolean
    callType?: boolean
    marketCap?: boolean
    liquidity?: boolean
    volume24h?: boolean
    currentPriceUsd?: boolean
    priceUpdatedAt?: boolean
    currentMarketCap?: boolean
    marketCapUpdatedAt?: boolean
    dexScreenerUrl?: boolean
    jupiterUrl?: boolean
    raydiumUrl?: boolean
    metadata?: boolean
    isValid?: boolean
    parsedAt?: boolean
  }

  export type CallOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "messageId" | "rawMessage" | "messageTimestamp" | "tokenSymbol" | "tokenName" | "contractAddress" | "blockchain" | "sqdgnLabel" | "callType" | "marketCap" | "liquidity" | "volume24h" | "currentPriceUsd" | "priceUpdatedAt" | "currentMarketCap" | "marketCapUpdatedAt" | "dexScreenerUrl" | "jupiterUrl" | "raydiumUrl" | "metadata" | "isValid" | "parsedAt", ExtArgs["result"]["call"]>
  export type CallInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tradingPositions?: boolean | Call$tradingPositionsArgs<ExtArgs>
    autoBuyQueue?: boolean | Call$autoBuyQueueArgs<ExtArgs>
    _count?: boolean | CallCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type CallIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type CallIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $CallPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Call"
    objects: {
      tradingPositions: Prisma.$TradingPositionPayload<ExtArgs>[]
      autoBuyQueue: Prisma.$AutoBuyQueuePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      messageId: string
      rawMessage: string
      messageTimestamp: Date | null
      tokenSymbol: string | null
      tokenName: string | null
      contractAddress: string | null
      blockchain: string | null
      sqdgnLabel: string | null
      callType: string | null
      marketCap: Prisma.Decimal | null
      liquidity: Prisma.Decimal | null
      volume24h: Prisma.Decimal | null
      currentPriceUsd: Prisma.Decimal | null
      priceUpdatedAt: Date | null
      currentMarketCap: Prisma.Decimal | null
      marketCapUpdatedAt: Date | null
      dexScreenerUrl: string | null
      jupiterUrl: string | null
      raydiumUrl: string | null
      metadata: Prisma.JsonValue | null
      isValid: boolean
      parsedAt: Date
    }, ExtArgs["result"]["call"]>
    composites: {}
  }

  type CallGetPayload<S extends boolean | null | undefined | CallDefaultArgs> = $Result.GetResult<Prisma.$CallPayload, S>

  type CallCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CallFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CallCountAggregateInputType | true
    }

  export interface CallDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Call'], meta: { name: 'Call' } }
    /**
     * Find zero or one Call that matches the filter.
     * @param {CallFindUniqueArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CallFindUniqueArgs>(args: SelectSubset<T, CallFindUniqueArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Call that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CallFindUniqueOrThrowArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CallFindUniqueOrThrowArgs>(args: SelectSubset<T, CallFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Call that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindFirstArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CallFindFirstArgs>(args?: SelectSubset<T, CallFindFirstArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Call that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindFirstOrThrowArgs} args - Arguments to find a Call
     * @example
     * // Get one Call
     * const call = await prisma.call.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CallFindFirstOrThrowArgs>(args?: SelectSubset<T, CallFindFirstOrThrowArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Calls that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Calls
     * const calls = await prisma.call.findMany()
     * 
     * // Get first 10 Calls
     * const calls = await prisma.call.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const callWithIdOnly = await prisma.call.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends CallFindManyArgs>(args?: SelectSubset<T, CallFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Call.
     * @param {CallCreateArgs} args - Arguments to create a Call.
     * @example
     * // Create one Call
     * const Call = await prisma.call.create({
     *   data: {
     *     // ... data to create a Call
     *   }
     * })
     * 
     */
    create<T extends CallCreateArgs>(args: SelectSubset<T, CallCreateArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Calls.
     * @param {CallCreateManyArgs} args - Arguments to create many Calls.
     * @example
     * // Create many Calls
     * const call = await prisma.call.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CallCreateManyArgs>(args?: SelectSubset<T, CallCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Calls and returns the data saved in the database.
     * @param {CallCreateManyAndReturnArgs} args - Arguments to create many Calls.
     * @example
     * // Create many Calls
     * const call = await prisma.call.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Calls and only return the `id`
     * const callWithIdOnly = await prisma.call.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CallCreateManyAndReturnArgs>(args?: SelectSubset<T, CallCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Call.
     * @param {CallDeleteArgs} args - Arguments to delete one Call.
     * @example
     * // Delete one Call
     * const Call = await prisma.call.delete({
     *   where: {
     *     // ... filter to delete one Call
     *   }
     * })
     * 
     */
    delete<T extends CallDeleteArgs>(args: SelectSubset<T, CallDeleteArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Call.
     * @param {CallUpdateArgs} args - Arguments to update one Call.
     * @example
     * // Update one Call
     * const call = await prisma.call.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CallUpdateArgs>(args: SelectSubset<T, CallUpdateArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Calls.
     * @param {CallDeleteManyArgs} args - Arguments to filter Calls to delete.
     * @example
     * // Delete a few Calls
     * const { count } = await prisma.call.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CallDeleteManyArgs>(args?: SelectSubset<T, CallDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Calls
     * const call = await prisma.call.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CallUpdateManyArgs>(args: SelectSubset<T, CallUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calls and returns the data updated in the database.
     * @param {CallUpdateManyAndReturnArgs} args - Arguments to update many Calls.
     * @example
     * // Update many Calls
     * const call = await prisma.call.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Calls and only return the `id`
     * const callWithIdOnly = await prisma.call.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CallUpdateManyAndReturnArgs>(args: SelectSubset<T, CallUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Call.
     * @param {CallUpsertArgs} args - Arguments to update or create a Call.
     * @example
     * // Update or create a Call
     * const call = await prisma.call.upsert({
     *   create: {
     *     // ... data to create a Call
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Call we want to update
     *   }
     * })
     */
    upsert<T extends CallUpsertArgs>(args: SelectSubset<T, CallUpsertArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Calls.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallCountArgs} args - Arguments to filter Calls to count.
     * @example
     * // Count the number of Calls
     * const count = await prisma.call.count({
     *   where: {
     *     // ... the filter for the Calls we want to count
     *   }
     * })
    **/
    count<T extends CallCountArgs>(
      args?: Subset<T, CallCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CallCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Call.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CallAggregateArgs>(args: Subset<T, CallAggregateArgs>): Prisma.PrismaPromise<GetCallAggregateType<T>>

    /**
     * Group by Call.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CallGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CallGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CallGroupByArgs['orderBy'] }
        : { orderBy?: CallGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CallGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCallGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Call model
   */
  readonly fields: CallFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Call.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CallClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    tradingPositions<T extends Call$tradingPositionsArgs<ExtArgs> = {}>(args?: Subset<T, Call$tradingPositionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    autoBuyQueue<T extends Call$autoBuyQueueArgs<ExtArgs> = {}>(args?: Subset<T, Call$autoBuyQueueArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Call model
   */
  interface CallFieldRefs {
    readonly id: FieldRef<"Call", 'String'>
    readonly createdAt: FieldRef<"Call", 'DateTime'>
    readonly messageId: FieldRef<"Call", 'String'>
    readonly rawMessage: FieldRef<"Call", 'String'>
    readonly messageTimestamp: FieldRef<"Call", 'DateTime'>
    readonly tokenSymbol: FieldRef<"Call", 'String'>
    readonly tokenName: FieldRef<"Call", 'String'>
    readonly contractAddress: FieldRef<"Call", 'String'>
    readonly blockchain: FieldRef<"Call", 'String'>
    readonly sqdgnLabel: FieldRef<"Call", 'String'>
    readonly callType: FieldRef<"Call", 'String'>
    readonly marketCap: FieldRef<"Call", 'Decimal'>
    readonly liquidity: FieldRef<"Call", 'Decimal'>
    readonly volume24h: FieldRef<"Call", 'Decimal'>
    readonly currentPriceUsd: FieldRef<"Call", 'Decimal'>
    readonly priceUpdatedAt: FieldRef<"Call", 'DateTime'>
    readonly currentMarketCap: FieldRef<"Call", 'Decimal'>
    readonly marketCapUpdatedAt: FieldRef<"Call", 'DateTime'>
    readonly dexScreenerUrl: FieldRef<"Call", 'String'>
    readonly jupiterUrl: FieldRef<"Call", 'String'>
    readonly raydiumUrl: FieldRef<"Call", 'String'>
    readonly metadata: FieldRef<"Call", 'Json'>
    readonly isValid: FieldRef<"Call", 'Boolean'>
    readonly parsedAt: FieldRef<"Call", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Call findUnique
   */
  export type CallFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call findUniqueOrThrow
   */
  export type CallFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call findFirst
   */
  export type CallFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calls.
     */
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call findFirstOrThrow
   */
  export type CallFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Call to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calls.
     */
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call findMany
   */
  export type CallFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter, which Calls to fetch.
     */
    where?: CallWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calls to fetch.
     */
    orderBy?: CallOrderByWithRelationInput | CallOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Calls.
     */
    cursor?: CallWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calls from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calls.
     */
    skip?: number
    distinct?: CallScalarFieldEnum | CallScalarFieldEnum[]
  }

  /**
   * Call create
   */
  export type CallCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The data needed to create a Call.
     */
    data: XOR<CallCreateInput, CallUncheckedCreateInput>
  }

  /**
   * Call createMany
   */
  export type CallCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Calls.
     */
    data: CallCreateManyInput | CallCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Call createManyAndReturn
   */
  export type CallCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * The data used to create many Calls.
     */
    data: CallCreateManyInput | CallCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Call update
   */
  export type CallUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The data needed to update a Call.
     */
    data: XOR<CallUpdateInput, CallUncheckedUpdateInput>
    /**
     * Choose, which Call to update.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call updateMany
   */
  export type CallUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Calls.
     */
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyInput>
    /**
     * Filter which Calls to update
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to update.
     */
    limit?: number
  }

  /**
   * Call updateManyAndReturn
   */
  export type CallUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * The data used to update Calls.
     */
    data: XOR<CallUpdateManyMutationInput, CallUncheckedUpdateManyInput>
    /**
     * Filter which Calls to update
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to update.
     */
    limit?: number
  }

  /**
   * Call upsert
   */
  export type CallUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * The filter to search for the Call to update in case it exists.
     */
    where: CallWhereUniqueInput
    /**
     * In case the Call found by the `where` argument doesn't exist, create a new Call with this data.
     */
    create: XOR<CallCreateInput, CallUncheckedCreateInput>
    /**
     * In case the Call was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CallUpdateInput, CallUncheckedUpdateInput>
  }

  /**
   * Call delete
   */
  export type CallDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    /**
     * Filter which Call to delete.
     */
    where: CallWhereUniqueInput
  }

  /**
   * Call deleteMany
   */
  export type CallDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Calls to delete
     */
    where?: CallWhereInput
    /**
     * Limit how many Calls to delete.
     */
    limit?: number
  }

  /**
   * Call.tradingPositions
   */
  export type Call$tradingPositionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    where?: TradingPositionWhereInput
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    cursor?: TradingPositionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * Call.autoBuyQueue
   */
  export type Call$autoBuyQueueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    where?: AutoBuyQueueWhereInput
    orderBy?: AutoBuyQueueOrderByWithRelationInput | AutoBuyQueueOrderByWithRelationInput[]
    cursor?: AutoBuyQueueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AutoBuyQueueScalarFieldEnum | AutoBuyQueueScalarFieldEnum[]
  }

  /**
   * Call without action
   */
  export type CallDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
  }


  /**
   * Model TokenPriceSnapshot
   */

  export type AggregateTokenPriceSnapshot = {
    _count: TokenPriceSnapshotCountAggregateOutputType | null
    _avg: TokenPriceSnapshotAvgAggregateOutputType | null
    _sum: TokenPriceSnapshotSumAggregateOutputType | null
    _min: TokenPriceSnapshotMinAggregateOutputType | null
    _max: TokenPriceSnapshotMaxAggregateOutputType | null
  }

  export type TokenPriceSnapshotAvgAggregateOutputType = {
    priceUsd: number | null
    priceNative: number | null
    marketCap: number | null
    volume5m: number | null
    volume1h: number | null
    volume24h: number | null
    liquidityUsd: number | null
    priceChange5m: number | null
    priceChange1h: number | null
    priceChange24h: number | null
    txnBuys5m: number | null
    txnSells5m: number | null
  }

  export type TokenPriceSnapshotSumAggregateOutputType = {
    priceUsd: number | null
    priceNative: number | null
    marketCap: number | null
    volume5m: number | null
    volume1h: number | null
    volume24h: number | null
    liquidityUsd: number | null
    priceChange5m: number | null
    priceChange1h: number | null
    priceChange24h: number | null
    txnBuys5m: number | null
    txnSells5m: number | null
  }

  export type TokenPriceSnapshotMinAggregateOutputType = {
    time: Date | null
    tokenAddress: string | null
    priceUsd: number | null
    priceNative: number | null
    marketCap: number | null
    volume5m: number | null
    volume1h: number | null
    volume24h: number | null
    liquidityUsd: number | null
    priceChange5m: number | null
    priceChange1h: number | null
    priceChange24h: number | null
    txnBuys5m: number | null
    txnSells5m: number | null
    dexId: string | null
    pairAddress: string | null
    source: string | null
    createdAt: Date | null
  }

  export type TokenPriceSnapshotMaxAggregateOutputType = {
    time: Date | null
    tokenAddress: string | null
    priceUsd: number | null
    priceNative: number | null
    marketCap: number | null
    volume5m: number | null
    volume1h: number | null
    volume24h: number | null
    liquidityUsd: number | null
    priceChange5m: number | null
    priceChange1h: number | null
    priceChange24h: number | null
    txnBuys5m: number | null
    txnSells5m: number | null
    dexId: string | null
    pairAddress: string | null
    source: string | null
    createdAt: Date | null
  }

  export type TokenPriceSnapshotCountAggregateOutputType = {
    time: number
    tokenAddress: number
    priceUsd: number
    priceNative: number
    marketCap: number
    volume5m: number
    volume1h: number
    volume24h: number
    liquidityUsd: number
    priceChange5m: number
    priceChange1h: number
    priceChange24h: number
    txnBuys5m: number
    txnSells5m: number
    dexId: number
    pairAddress: number
    source: number
    createdAt: number
    _all: number
  }


  export type TokenPriceSnapshotAvgAggregateInputType = {
    priceUsd?: true
    priceNative?: true
    marketCap?: true
    volume5m?: true
    volume1h?: true
    volume24h?: true
    liquidityUsd?: true
    priceChange5m?: true
    priceChange1h?: true
    priceChange24h?: true
    txnBuys5m?: true
    txnSells5m?: true
  }

  export type TokenPriceSnapshotSumAggregateInputType = {
    priceUsd?: true
    priceNative?: true
    marketCap?: true
    volume5m?: true
    volume1h?: true
    volume24h?: true
    liquidityUsd?: true
    priceChange5m?: true
    priceChange1h?: true
    priceChange24h?: true
    txnBuys5m?: true
    txnSells5m?: true
  }

  export type TokenPriceSnapshotMinAggregateInputType = {
    time?: true
    tokenAddress?: true
    priceUsd?: true
    priceNative?: true
    marketCap?: true
    volume5m?: true
    volume1h?: true
    volume24h?: true
    liquidityUsd?: true
    priceChange5m?: true
    priceChange1h?: true
    priceChange24h?: true
    txnBuys5m?: true
    txnSells5m?: true
    dexId?: true
    pairAddress?: true
    source?: true
    createdAt?: true
  }

  export type TokenPriceSnapshotMaxAggregateInputType = {
    time?: true
    tokenAddress?: true
    priceUsd?: true
    priceNative?: true
    marketCap?: true
    volume5m?: true
    volume1h?: true
    volume24h?: true
    liquidityUsd?: true
    priceChange5m?: true
    priceChange1h?: true
    priceChange24h?: true
    txnBuys5m?: true
    txnSells5m?: true
    dexId?: true
    pairAddress?: true
    source?: true
    createdAt?: true
  }

  export type TokenPriceSnapshotCountAggregateInputType = {
    time?: true
    tokenAddress?: true
    priceUsd?: true
    priceNative?: true
    marketCap?: true
    volume5m?: true
    volume1h?: true
    volume24h?: true
    liquidityUsd?: true
    priceChange5m?: true
    priceChange1h?: true
    priceChange24h?: true
    txnBuys5m?: true
    txnSells5m?: true
    dexId?: true
    pairAddress?: true
    source?: true
    createdAt?: true
    _all?: true
  }

  export type TokenPriceSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TokenPriceSnapshot to aggregate.
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenPriceSnapshots to fetch.
     */
    orderBy?: TokenPriceSnapshotOrderByWithRelationInput | TokenPriceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TokenPriceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenPriceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenPriceSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TokenPriceSnapshots
    **/
    _count?: true | TokenPriceSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TokenPriceSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TokenPriceSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TokenPriceSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TokenPriceSnapshotMaxAggregateInputType
  }

  export type GetTokenPriceSnapshotAggregateType<T extends TokenPriceSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateTokenPriceSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTokenPriceSnapshot[P]>
      : GetScalarType<T[P], AggregateTokenPriceSnapshot[P]>
  }




  export type TokenPriceSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TokenPriceSnapshotWhereInput
    orderBy?: TokenPriceSnapshotOrderByWithAggregationInput | TokenPriceSnapshotOrderByWithAggregationInput[]
    by: TokenPriceSnapshotScalarFieldEnum[] | TokenPriceSnapshotScalarFieldEnum
    having?: TokenPriceSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TokenPriceSnapshotCountAggregateInputType | true
    _avg?: TokenPriceSnapshotAvgAggregateInputType
    _sum?: TokenPriceSnapshotSumAggregateInputType
    _min?: TokenPriceSnapshotMinAggregateInputType
    _max?: TokenPriceSnapshotMaxAggregateInputType
  }

  export type TokenPriceSnapshotGroupByOutputType = {
    time: Date
    tokenAddress: string
    priceUsd: number
    priceNative: number | null
    marketCap: number | null
    volume5m: number | null
    volume1h: number | null
    volume24h: number | null
    liquidityUsd: number | null
    priceChange5m: number | null
    priceChange1h: number | null
    priceChange24h: number | null
    txnBuys5m: number | null
    txnSells5m: number | null
    dexId: string | null
    pairAddress: string | null
    source: string
    createdAt: Date
    _count: TokenPriceSnapshotCountAggregateOutputType | null
    _avg: TokenPriceSnapshotAvgAggregateOutputType | null
    _sum: TokenPriceSnapshotSumAggregateOutputType | null
    _min: TokenPriceSnapshotMinAggregateOutputType | null
    _max: TokenPriceSnapshotMaxAggregateOutputType | null
  }

  type GetTokenPriceSnapshotGroupByPayload<T extends TokenPriceSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TokenPriceSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TokenPriceSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TokenPriceSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], TokenPriceSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type TokenPriceSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    tokenAddress?: boolean
    priceUsd?: boolean
    priceNative?: boolean
    marketCap?: boolean
    volume5m?: boolean
    volume1h?: boolean
    volume24h?: boolean
    liquidityUsd?: boolean
    priceChange5m?: boolean
    priceChange1h?: boolean
    priceChange24h?: boolean
    txnBuys5m?: boolean
    txnSells5m?: boolean
    dexId?: boolean
    pairAddress?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tokenPriceSnapshot"]>

  export type TokenPriceSnapshotSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    tokenAddress?: boolean
    priceUsd?: boolean
    priceNative?: boolean
    marketCap?: boolean
    volume5m?: boolean
    volume1h?: boolean
    volume24h?: boolean
    liquidityUsd?: boolean
    priceChange5m?: boolean
    priceChange1h?: boolean
    priceChange24h?: boolean
    txnBuys5m?: boolean
    txnSells5m?: boolean
    dexId?: boolean
    pairAddress?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tokenPriceSnapshot"]>

  export type TokenPriceSnapshotSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    time?: boolean
    tokenAddress?: boolean
    priceUsd?: boolean
    priceNative?: boolean
    marketCap?: boolean
    volume5m?: boolean
    volume1h?: boolean
    volume24h?: boolean
    liquidityUsd?: boolean
    priceChange5m?: boolean
    priceChange1h?: boolean
    priceChange24h?: boolean
    txnBuys5m?: boolean
    txnSells5m?: boolean
    dexId?: boolean
    pairAddress?: boolean
    source?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["tokenPriceSnapshot"]>

  export type TokenPriceSnapshotSelectScalar = {
    time?: boolean
    tokenAddress?: boolean
    priceUsd?: boolean
    priceNative?: boolean
    marketCap?: boolean
    volume5m?: boolean
    volume1h?: boolean
    volume24h?: boolean
    liquidityUsd?: boolean
    priceChange5m?: boolean
    priceChange1h?: boolean
    priceChange24h?: boolean
    txnBuys5m?: boolean
    txnSells5m?: boolean
    dexId?: boolean
    pairAddress?: boolean
    source?: boolean
    createdAt?: boolean
  }

  export type TokenPriceSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"time" | "tokenAddress" | "priceUsd" | "priceNative" | "marketCap" | "volume5m" | "volume1h" | "volume24h" | "liquidityUsd" | "priceChange5m" | "priceChange1h" | "priceChange24h" | "txnBuys5m" | "txnSells5m" | "dexId" | "pairAddress" | "source" | "createdAt", ExtArgs["result"]["tokenPriceSnapshot"]>

  export type $TokenPriceSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TokenPriceSnapshot"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      time: Date
      tokenAddress: string
      priceUsd: number
      priceNative: number | null
      marketCap: number | null
      volume5m: number | null
      volume1h: number | null
      volume24h: number | null
      liquidityUsd: number | null
      priceChange5m: number | null
      priceChange1h: number | null
      priceChange24h: number | null
      txnBuys5m: number | null
      txnSells5m: number | null
      dexId: string | null
      pairAddress: string | null
      source: string
      createdAt: Date
    }, ExtArgs["result"]["tokenPriceSnapshot"]>
    composites: {}
  }

  type TokenPriceSnapshotGetPayload<S extends boolean | null | undefined | TokenPriceSnapshotDefaultArgs> = $Result.GetResult<Prisma.$TokenPriceSnapshotPayload, S>

  type TokenPriceSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TokenPriceSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TokenPriceSnapshotCountAggregateInputType | true
    }

  export interface TokenPriceSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TokenPriceSnapshot'], meta: { name: 'TokenPriceSnapshot' } }
    /**
     * Find zero or one TokenPriceSnapshot that matches the filter.
     * @param {TokenPriceSnapshotFindUniqueArgs} args - Arguments to find a TokenPriceSnapshot
     * @example
     * // Get one TokenPriceSnapshot
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TokenPriceSnapshotFindUniqueArgs>(args: SelectSubset<T, TokenPriceSnapshotFindUniqueArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TokenPriceSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TokenPriceSnapshotFindUniqueOrThrowArgs} args - Arguments to find a TokenPriceSnapshot
     * @example
     * // Get one TokenPriceSnapshot
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TokenPriceSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, TokenPriceSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TokenPriceSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotFindFirstArgs} args - Arguments to find a TokenPriceSnapshot
     * @example
     * // Get one TokenPriceSnapshot
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TokenPriceSnapshotFindFirstArgs>(args?: SelectSubset<T, TokenPriceSnapshotFindFirstArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TokenPriceSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotFindFirstOrThrowArgs} args - Arguments to find a TokenPriceSnapshot
     * @example
     * // Get one TokenPriceSnapshot
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TokenPriceSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, TokenPriceSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TokenPriceSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TokenPriceSnapshots
     * const tokenPriceSnapshots = await prisma.tokenPriceSnapshot.findMany()
     * 
     * // Get first 10 TokenPriceSnapshots
     * const tokenPriceSnapshots = await prisma.tokenPriceSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `time`
     * const tokenPriceSnapshotWithTimeOnly = await prisma.tokenPriceSnapshot.findMany({ select: { time: true } })
     * 
     */
    findMany<T extends TokenPriceSnapshotFindManyArgs>(args?: SelectSubset<T, TokenPriceSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TokenPriceSnapshot.
     * @param {TokenPriceSnapshotCreateArgs} args - Arguments to create a TokenPriceSnapshot.
     * @example
     * // Create one TokenPriceSnapshot
     * const TokenPriceSnapshot = await prisma.tokenPriceSnapshot.create({
     *   data: {
     *     // ... data to create a TokenPriceSnapshot
     *   }
     * })
     * 
     */
    create<T extends TokenPriceSnapshotCreateArgs>(args: SelectSubset<T, TokenPriceSnapshotCreateArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TokenPriceSnapshots.
     * @param {TokenPriceSnapshotCreateManyArgs} args - Arguments to create many TokenPriceSnapshots.
     * @example
     * // Create many TokenPriceSnapshots
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TokenPriceSnapshotCreateManyArgs>(args?: SelectSubset<T, TokenPriceSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TokenPriceSnapshots and returns the data saved in the database.
     * @param {TokenPriceSnapshotCreateManyAndReturnArgs} args - Arguments to create many TokenPriceSnapshots.
     * @example
     * // Create many TokenPriceSnapshots
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TokenPriceSnapshots and only return the `time`
     * const tokenPriceSnapshotWithTimeOnly = await prisma.tokenPriceSnapshot.createManyAndReturn({
     *   select: { time: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TokenPriceSnapshotCreateManyAndReturnArgs>(args?: SelectSubset<T, TokenPriceSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TokenPriceSnapshot.
     * @param {TokenPriceSnapshotDeleteArgs} args - Arguments to delete one TokenPriceSnapshot.
     * @example
     * // Delete one TokenPriceSnapshot
     * const TokenPriceSnapshot = await prisma.tokenPriceSnapshot.delete({
     *   where: {
     *     // ... filter to delete one TokenPriceSnapshot
     *   }
     * })
     * 
     */
    delete<T extends TokenPriceSnapshotDeleteArgs>(args: SelectSubset<T, TokenPriceSnapshotDeleteArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TokenPriceSnapshot.
     * @param {TokenPriceSnapshotUpdateArgs} args - Arguments to update one TokenPriceSnapshot.
     * @example
     * // Update one TokenPriceSnapshot
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TokenPriceSnapshotUpdateArgs>(args: SelectSubset<T, TokenPriceSnapshotUpdateArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TokenPriceSnapshots.
     * @param {TokenPriceSnapshotDeleteManyArgs} args - Arguments to filter TokenPriceSnapshots to delete.
     * @example
     * // Delete a few TokenPriceSnapshots
     * const { count } = await prisma.tokenPriceSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TokenPriceSnapshotDeleteManyArgs>(args?: SelectSubset<T, TokenPriceSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TokenPriceSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TokenPriceSnapshots
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TokenPriceSnapshotUpdateManyArgs>(args: SelectSubset<T, TokenPriceSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TokenPriceSnapshots and returns the data updated in the database.
     * @param {TokenPriceSnapshotUpdateManyAndReturnArgs} args - Arguments to update many TokenPriceSnapshots.
     * @example
     * // Update many TokenPriceSnapshots
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TokenPriceSnapshots and only return the `time`
     * const tokenPriceSnapshotWithTimeOnly = await prisma.tokenPriceSnapshot.updateManyAndReturn({
     *   select: { time: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TokenPriceSnapshotUpdateManyAndReturnArgs>(args: SelectSubset<T, TokenPriceSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TokenPriceSnapshot.
     * @param {TokenPriceSnapshotUpsertArgs} args - Arguments to update or create a TokenPriceSnapshot.
     * @example
     * // Update or create a TokenPriceSnapshot
     * const tokenPriceSnapshot = await prisma.tokenPriceSnapshot.upsert({
     *   create: {
     *     // ... data to create a TokenPriceSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TokenPriceSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends TokenPriceSnapshotUpsertArgs>(args: SelectSubset<T, TokenPriceSnapshotUpsertArgs<ExtArgs>>): Prisma__TokenPriceSnapshotClient<$Result.GetResult<Prisma.$TokenPriceSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TokenPriceSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotCountArgs} args - Arguments to filter TokenPriceSnapshots to count.
     * @example
     * // Count the number of TokenPriceSnapshots
     * const count = await prisma.tokenPriceSnapshot.count({
     *   where: {
     *     // ... the filter for the TokenPriceSnapshots we want to count
     *   }
     * })
    **/
    count<T extends TokenPriceSnapshotCountArgs>(
      args?: Subset<T, TokenPriceSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TokenPriceSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TokenPriceSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TokenPriceSnapshotAggregateArgs>(args: Subset<T, TokenPriceSnapshotAggregateArgs>): Prisma.PrismaPromise<GetTokenPriceSnapshotAggregateType<T>>

    /**
     * Group by TokenPriceSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TokenPriceSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TokenPriceSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TokenPriceSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: TokenPriceSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TokenPriceSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTokenPriceSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TokenPriceSnapshot model
   */
  readonly fields: TokenPriceSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TokenPriceSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TokenPriceSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TokenPriceSnapshot model
   */
  interface TokenPriceSnapshotFieldRefs {
    readonly time: FieldRef<"TokenPriceSnapshot", 'DateTime'>
    readonly tokenAddress: FieldRef<"TokenPriceSnapshot", 'String'>
    readonly priceUsd: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly priceNative: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly marketCap: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly volume5m: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly volume1h: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly volume24h: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly liquidityUsd: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly priceChange5m: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly priceChange1h: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly priceChange24h: FieldRef<"TokenPriceSnapshot", 'Float'>
    readonly txnBuys5m: FieldRef<"TokenPriceSnapshot", 'Int'>
    readonly txnSells5m: FieldRef<"TokenPriceSnapshot", 'Int'>
    readonly dexId: FieldRef<"TokenPriceSnapshot", 'String'>
    readonly pairAddress: FieldRef<"TokenPriceSnapshot", 'String'>
    readonly source: FieldRef<"TokenPriceSnapshot", 'String'>
    readonly createdAt: FieldRef<"TokenPriceSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TokenPriceSnapshot findUnique
   */
  export type TokenPriceSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which TokenPriceSnapshot to fetch.
     */
    where: TokenPriceSnapshotWhereUniqueInput
  }

  /**
   * TokenPriceSnapshot findUniqueOrThrow
   */
  export type TokenPriceSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which TokenPriceSnapshot to fetch.
     */
    where: TokenPriceSnapshotWhereUniqueInput
  }

  /**
   * TokenPriceSnapshot findFirst
   */
  export type TokenPriceSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which TokenPriceSnapshot to fetch.
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenPriceSnapshots to fetch.
     */
    orderBy?: TokenPriceSnapshotOrderByWithRelationInput | TokenPriceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TokenPriceSnapshots.
     */
    cursor?: TokenPriceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenPriceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenPriceSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TokenPriceSnapshots.
     */
    distinct?: TokenPriceSnapshotScalarFieldEnum | TokenPriceSnapshotScalarFieldEnum[]
  }

  /**
   * TokenPriceSnapshot findFirstOrThrow
   */
  export type TokenPriceSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which TokenPriceSnapshot to fetch.
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenPriceSnapshots to fetch.
     */
    orderBy?: TokenPriceSnapshotOrderByWithRelationInput | TokenPriceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TokenPriceSnapshots.
     */
    cursor?: TokenPriceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenPriceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenPriceSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TokenPriceSnapshots.
     */
    distinct?: TokenPriceSnapshotScalarFieldEnum | TokenPriceSnapshotScalarFieldEnum[]
  }

  /**
   * TokenPriceSnapshot findMany
   */
  export type TokenPriceSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * Filter, which TokenPriceSnapshots to fetch.
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TokenPriceSnapshots to fetch.
     */
    orderBy?: TokenPriceSnapshotOrderByWithRelationInput | TokenPriceSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TokenPriceSnapshots.
     */
    cursor?: TokenPriceSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TokenPriceSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TokenPriceSnapshots.
     */
    skip?: number
    distinct?: TokenPriceSnapshotScalarFieldEnum | TokenPriceSnapshotScalarFieldEnum[]
  }

  /**
   * TokenPriceSnapshot create
   */
  export type TokenPriceSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to create a TokenPriceSnapshot.
     */
    data: XOR<TokenPriceSnapshotCreateInput, TokenPriceSnapshotUncheckedCreateInput>
  }

  /**
   * TokenPriceSnapshot createMany
   */
  export type TokenPriceSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TokenPriceSnapshots.
     */
    data: TokenPriceSnapshotCreateManyInput | TokenPriceSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TokenPriceSnapshot createManyAndReturn
   */
  export type TokenPriceSnapshotCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * The data used to create many TokenPriceSnapshots.
     */
    data: TokenPriceSnapshotCreateManyInput | TokenPriceSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TokenPriceSnapshot update
   */
  export type TokenPriceSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * The data needed to update a TokenPriceSnapshot.
     */
    data: XOR<TokenPriceSnapshotUpdateInput, TokenPriceSnapshotUncheckedUpdateInput>
    /**
     * Choose, which TokenPriceSnapshot to update.
     */
    where: TokenPriceSnapshotWhereUniqueInput
  }

  /**
   * TokenPriceSnapshot updateMany
   */
  export type TokenPriceSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TokenPriceSnapshots.
     */
    data: XOR<TokenPriceSnapshotUpdateManyMutationInput, TokenPriceSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which TokenPriceSnapshots to update
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * Limit how many TokenPriceSnapshots to update.
     */
    limit?: number
  }

  /**
   * TokenPriceSnapshot updateManyAndReturn
   */
  export type TokenPriceSnapshotUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * The data used to update TokenPriceSnapshots.
     */
    data: XOR<TokenPriceSnapshotUpdateManyMutationInput, TokenPriceSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which TokenPriceSnapshots to update
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * Limit how many TokenPriceSnapshots to update.
     */
    limit?: number
  }

  /**
   * TokenPriceSnapshot upsert
   */
  export type TokenPriceSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * The filter to search for the TokenPriceSnapshot to update in case it exists.
     */
    where: TokenPriceSnapshotWhereUniqueInput
    /**
     * In case the TokenPriceSnapshot found by the `where` argument doesn't exist, create a new TokenPriceSnapshot with this data.
     */
    create: XOR<TokenPriceSnapshotCreateInput, TokenPriceSnapshotUncheckedCreateInput>
    /**
     * In case the TokenPriceSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TokenPriceSnapshotUpdateInput, TokenPriceSnapshotUncheckedUpdateInput>
  }

  /**
   * TokenPriceSnapshot delete
   */
  export type TokenPriceSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
    /**
     * Filter which TokenPriceSnapshot to delete.
     */
    where: TokenPriceSnapshotWhereUniqueInput
  }

  /**
   * TokenPriceSnapshot deleteMany
   */
  export type TokenPriceSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TokenPriceSnapshots to delete
     */
    where?: TokenPriceSnapshotWhereInput
    /**
     * Limit how many TokenPriceSnapshots to delete.
     */
    limit?: number
  }

  /**
   * TokenPriceSnapshot without action
   */
  export type TokenPriceSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TokenPriceSnapshot
     */
    select?: TokenPriceSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TokenPriceSnapshot
     */
    omit?: TokenPriceSnapshotOmit<ExtArgs> | null
  }


  /**
   * Model TradingPosition
   */

  export type AggregateTradingPosition = {
    _count: TradingPositionCountAggregateOutputType | null
    _avg: TradingPositionAvgAggregateOutputType | null
    _sum: TradingPositionSumAggregateOutputType | null
    _min: TradingPositionMinAggregateOutputType | null
    _max: TradingPositionMaxAggregateOutputType | null
  }

  export type TradingPositionAvgAggregateOutputType = {
    entryPrice: Decimal | null
    entryAmountSol: Decimal | null
    entryAmountTokens: Decimal | null
    currentPrice: Decimal | null
    currentValueSol: Decimal | null
    highestPrice: Decimal | null
    realizedPnlSol: Decimal | null
    unrealizedPnlSol: Decimal | null
    unrealizedPnlPercentage: Decimal | null
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    trailingStopPercentage: Decimal | null
    exitPrice: Decimal | null
    exitAmountSol: Decimal | null
  }

  export type TradingPositionSumAggregateOutputType = {
    entryPrice: Decimal | null
    entryAmountSol: Decimal | null
    entryAmountTokens: Decimal | null
    currentPrice: Decimal | null
    currentValueSol: Decimal | null
    highestPrice: Decimal | null
    realizedPnlSol: Decimal | null
    unrealizedPnlSol: Decimal | null
    unrealizedPnlPercentage: Decimal | null
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    trailingStopPercentage: Decimal | null
    exitPrice: Decimal | null
    exitAmountSol: Decimal | null
  }

  export type TradingPositionMinAggregateOutputType = {
    id: string | null
    userWalletAddress: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    entryPrice: Decimal | null
    entryAmountSol: Decimal | null
    entryAmountTokens: Decimal | null
    entryTxSignature: string | null
    currentPrice: Decimal | null
    currentValueSol: Decimal | null
    highestPrice: Decimal | null
    realizedPnlSol: Decimal | null
    unrealizedPnlSol: Decimal | null
    unrealizedPnlPercentage: Decimal | null
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    trailingStopPercentage: Decimal | null
    exitPrice: Decimal | null
    exitAmountSol: Decimal | null
    exitReason: string | null
    exitTxSignature: string | null
    status: string | null
    openedAt: Date | null
    closedAt: Date | null
    lastUpdated: Date | null
    callId: string | null
  }

  export type TradingPositionMaxAggregateOutputType = {
    id: string | null
    userWalletAddress: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    entryPrice: Decimal | null
    entryAmountSol: Decimal | null
    entryAmountTokens: Decimal | null
    entryTxSignature: string | null
    currentPrice: Decimal | null
    currentValueSol: Decimal | null
    highestPrice: Decimal | null
    realizedPnlSol: Decimal | null
    unrealizedPnlSol: Decimal | null
    unrealizedPnlPercentage: Decimal | null
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    trailingStopPercentage: Decimal | null
    exitPrice: Decimal | null
    exitAmountSol: Decimal | null
    exitReason: string | null
    exitTxSignature: string | null
    status: string | null
    openedAt: Date | null
    closedAt: Date | null
    lastUpdated: Date | null
    callId: string | null
  }

  export type TradingPositionCountAggregateOutputType = {
    id: number
    userWalletAddress: number
    tokenAddress: number
    tokenSymbol: number
    entryPrice: number
    entryAmountSol: number
    entryAmountTokens: number
    entryTxSignature: number
    currentPrice: number
    currentValueSol: number
    highestPrice: number
    realizedPnlSol: number
    unrealizedPnlSol: number
    unrealizedPnlPercentage: number
    stopLossPrice: number
    takeProfitPrice: number
    trailingStopPercentage: number
    exitPrice: number
    exitAmountSol: number
    exitReason: number
    exitTxSignature: number
    status: number
    openedAt: number
    closedAt: number
    lastUpdated: number
    callId: number
    _all: number
  }


  export type TradingPositionAvgAggregateInputType = {
    entryPrice?: true
    entryAmountSol?: true
    entryAmountTokens?: true
    currentPrice?: true
    currentValueSol?: true
    highestPrice?: true
    realizedPnlSol?: true
    unrealizedPnlSol?: true
    unrealizedPnlPercentage?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    trailingStopPercentage?: true
    exitPrice?: true
    exitAmountSol?: true
  }

  export type TradingPositionSumAggregateInputType = {
    entryPrice?: true
    entryAmountSol?: true
    entryAmountTokens?: true
    currentPrice?: true
    currentValueSol?: true
    highestPrice?: true
    realizedPnlSol?: true
    unrealizedPnlSol?: true
    unrealizedPnlPercentage?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    trailingStopPercentage?: true
    exitPrice?: true
    exitAmountSol?: true
  }

  export type TradingPositionMinAggregateInputType = {
    id?: true
    userWalletAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    entryPrice?: true
    entryAmountSol?: true
    entryAmountTokens?: true
    entryTxSignature?: true
    currentPrice?: true
    currentValueSol?: true
    highestPrice?: true
    realizedPnlSol?: true
    unrealizedPnlSol?: true
    unrealizedPnlPercentage?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    trailingStopPercentage?: true
    exitPrice?: true
    exitAmountSol?: true
    exitReason?: true
    exitTxSignature?: true
    status?: true
    openedAt?: true
    closedAt?: true
    lastUpdated?: true
    callId?: true
  }

  export type TradingPositionMaxAggregateInputType = {
    id?: true
    userWalletAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    entryPrice?: true
    entryAmountSol?: true
    entryAmountTokens?: true
    entryTxSignature?: true
    currentPrice?: true
    currentValueSol?: true
    highestPrice?: true
    realizedPnlSol?: true
    unrealizedPnlSol?: true
    unrealizedPnlPercentage?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    trailingStopPercentage?: true
    exitPrice?: true
    exitAmountSol?: true
    exitReason?: true
    exitTxSignature?: true
    status?: true
    openedAt?: true
    closedAt?: true
    lastUpdated?: true
    callId?: true
  }

  export type TradingPositionCountAggregateInputType = {
    id?: true
    userWalletAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    entryPrice?: true
    entryAmountSol?: true
    entryAmountTokens?: true
    entryTxSignature?: true
    currentPrice?: true
    currentValueSol?: true
    highestPrice?: true
    realizedPnlSol?: true
    unrealizedPnlSol?: true
    unrealizedPnlPercentage?: true
    stopLossPrice?: true
    takeProfitPrice?: true
    trailingStopPercentage?: true
    exitPrice?: true
    exitAmountSol?: true
    exitReason?: true
    exitTxSignature?: true
    status?: true
    openedAt?: true
    closedAt?: true
    lastUpdated?: true
    callId?: true
    _all?: true
  }

  export type TradingPositionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingPosition to aggregate.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradingPositions
    **/
    _count?: true | TradingPositionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradingPositionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradingPositionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradingPositionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradingPositionMaxAggregateInputType
  }

  export type GetTradingPositionAggregateType<T extends TradingPositionAggregateArgs> = {
        [P in keyof T & keyof AggregateTradingPosition]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradingPosition[P]>
      : GetScalarType<T[P], AggregateTradingPosition[P]>
  }




  export type TradingPositionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradingPositionWhereInput
    orderBy?: TradingPositionOrderByWithAggregationInput | TradingPositionOrderByWithAggregationInput[]
    by: TradingPositionScalarFieldEnum[] | TradingPositionScalarFieldEnum
    having?: TradingPositionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradingPositionCountAggregateInputType | true
    _avg?: TradingPositionAvgAggregateInputType
    _sum?: TradingPositionSumAggregateInputType
    _min?: TradingPositionMinAggregateInputType
    _max?: TradingPositionMaxAggregateInputType
  }

  export type TradingPositionGroupByOutputType = {
    id: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol: string | null
    entryPrice: Decimal
    entryAmountSol: Decimal
    entryAmountTokens: Decimal
    entryTxSignature: string | null
    currentPrice: Decimal | null
    currentValueSol: Decimal | null
    highestPrice: Decimal | null
    realizedPnlSol: Decimal
    unrealizedPnlSol: Decimal
    unrealizedPnlPercentage: Decimal
    stopLossPrice: Decimal | null
    takeProfitPrice: Decimal | null
    trailingStopPercentage: Decimal | null
    exitPrice: Decimal | null
    exitAmountSol: Decimal | null
    exitReason: string | null
    exitTxSignature: string | null
    status: string
    openedAt: Date
    closedAt: Date | null
    lastUpdated: Date
    callId: string | null
    _count: TradingPositionCountAggregateOutputType | null
    _avg: TradingPositionAvgAggregateOutputType | null
    _sum: TradingPositionSumAggregateOutputType | null
    _min: TradingPositionMinAggregateOutputType | null
    _max: TradingPositionMaxAggregateOutputType | null
  }

  type GetTradingPositionGroupByPayload<T extends TradingPositionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradingPositionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradingPositionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradingPositionGroupByOutputType[P]>
            : GetScalarType<T[P], TradingPositionGroupByOutputType[P]>
        }
      >
    >


  export type TradingPositionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    entryPrice?: boolean
    entryAmountSol?: boolean
    entryAmountTokens?: boolean
    entryTxSignature?: boolean
    currentPrice?: boolean
    currentValueSol?: boolean
    highestPrice?: boolean
    realizedPnlSol?: boolean
    unrealizedPnlSol?: boolean
    unrealizedPnlPercentage?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    trailingStopPercentage?: boolean
    exitPrice?: boolean
    exitAmountSol?: boolean
    exitReason?: boolean
    exitTxSignature?: boolean
    status?: boolean
    openedAt?: boolean
    closedAt?: boolean
    lastUpdated?: boolean
    callId?: boolean
    call?: boolean | TradingPosition$callArgs<ExtArgs>
    trailingStops?: boolean | TradingPosition$trailingStopsArgs<ExtArgs>
    tradeHistory?: boolean | TradingPosition$tradeHistoryArgs<ExtArgs>
    priceAlerts?: boolean | TradingPosition$priceAlertsArgs<ExtArgs>
    _count?: boolean | TradingPositionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPosition"]>

  export type TradingPositionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    entryPrice?: boolean
    entryAmountSol?: boolean
    entryAmountTokens?: boolean
    entryTxSignature?: boolean
    currentPrice?: boolean
    currentValueSol?: boolean
    highestPrice?: boolean
    realizedPnlSol?: boolean
    unrealizedPnlSol?: boolean
    unrealizedPnlPercentage?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    trailingStopPercentage?: boolean
    exitPrice?: boolean
    exitAmountSol?: boolean
    exitReason?: boolean
    exitTxSignature?: boolean
    status?: boolean
    openedAt?: boolean
    closedAt?: boolean
    lastUpdated?: boolean
    callId?: boolean
    call?: boolean | TradingPosition$callArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPosition"]>

  export type TradingPositionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    entryPrice?: boolean
    entryAmountSol?: boolean
    entryAmountTokens?: boolean
    entryTxSignature?: boolean
    currentPrice?: boolean
    currentValueSol?: boolean
    highestPrice?: boolean
    realizedPnlSol?: boolean
    unrealizedPnlSol?: boolean
    unrealizedPnlPercentage?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    trailingStopPercentage?: boolean
    exitPrice?: boolean
    exitAmountSol?: boolean
    exitReason?: boolean
    exitTxSignature?: boolean
    status?: boolean
    openedAt?: boolean
    closedAt?: boolean
    lastUpdated?: boolean
    callId?: boolean
    call?: boolean | TradingPosition$callArgs<ExtArgs>
  }, ExtArgs["result"]["tradingPosition"]>

  export type TradingPositionSelectScalar = {
    id?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    entryPrice?: boolean
    entryAmountSol?: boolean
    entryAmountTokens?: boolean
    entryTxSignature?: boolean
    currentPrice?: boolean
    currentValueSol?: boolean
    highestPrice?: boolean
    realizedPnlSol?: boolean
    unrealizedPnlSol?: boolean
    unrealizedPnlPercentage?: boolean
    stopLossPrice?: boolean
    takeProfitPrice?: boolean
    trailingStopPercentage?: boolean
    exitPrice?: boolean
    exitAmountSol?: boolean
    exitReason?: boolean
    exitTxSignature?: boolean
    status?: boolean
    openedAt?: boolean
    closedAt?: boolean
    lastUpdated?: boolean
    callId?: boolean
  }

  export type TradingPositionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userWalletAddress" | "tokenAddress" | "tokenSymbol" | "entryPrice" | "entryAmountSol" | "entryAmountTokens" | "entryTxSignature" | "currentPrice" | "currentValueSol" | "highestPrice" | "realizedPnlSol" | "unrealizedPnlSol" | "unrealizedPnlPercentage" | "stopLossPrice" | "takeProfitPrice" | "trailingStopPercentage" | "exitPrice" | "exitAmountSol" | "exitReason" | "exitTxSignature" | "status" | "openedAt" | "closedAt" | "lastUpdated" | "callId", ExtArgs["result"]["tradingPosition"]>
  export type TradingPositionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    call?: boolean | TradingPosition$callArgs<ExtArgs>
    trailingStops?: boolean | TradingPosition$trailingStopsArgs<ExtArgs>
    tradeHistory?: boolean | TradingPosition$tradeHistoryArgs<ExtArgs>
    priceAlerts?: boolean | TradingPosition$priceAlertsArgs<ExtArgs>
    _count?: boolean | TradingPositionCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradingPositionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    call?: boolean | TradingPosition$callArgs<ExtArgs>
  }
  export type TradingPositionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    call?: boolean | TradingPosition$callArgs<ExtArgs>
  }

  export type $TradingPositionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradingPosition"
    objects: {
      call: Prisma.$CallPayload<ExtArgs> | null
      trailingStops: Prisma.$TrailingStopPayload<ExtArgs>[]
      tradeHistory: Prisma.$TradeHistoryPayload<ExtArgs>[]
      priceAlerts: Prisma.$PriceAlertPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userWalletAddress: string
      tokenAddress: string
      tokenSymbol: string | null
      entryPrice: Prisma.Decimal
      entryAmountSol: Prisma.Decimal
      entryAmountTokens: Prisma.Decimal
      entryTxSignature: string | null
      currentPrice: Prisma.Decimal | null
      currentValueSol: Prisma.Decimal | null
      highestPrice: Prisma.Decimal | null
      realizedPnlSol: Prisma.Decimal
      unrealizedPnlSol: Prisma.Decimal
      unrealizedPnlPercentage: Prisma.Decimal
      stopLossPrice: Prisma.Decimal | null
      takeProfitPrice: Prisma.Decimal | null
      trailingStopPercentage: Prisma.Decimal | null
      exitPrice: Prisma.Decimal | null
      exitAmountSol: Prisma.Decimal | null
      exitReason: string | null
      exitTxSignature: string | null
      status: string
      openedAt: Date
      closedAt: Date | null
      lastUpdated: Date
      callId: string | null
    }, ExtArgs["result"]["tradingPosition"]>
    composites: {}
  }

  type TradingPositionGetPayload<S extends boolean | null | undefined | TradingPositionDefaultArgs> = $Result.GetResult<Prisma.$TradingPositionPayload, S>

  type TradingPositionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradingPositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradingPositionCountAggregateInputType | true
    }

  export interface TradingPositionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradingPosition'], meta: { name: 'TradingPosition' } }
    /**
     * Find zero or one TradingPosition that matches the filter.
     * @param {TradingPositionFindUniqueArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradingPositionFindUniqueArgs>(args: SelectSubset<T, TradingPositionFindUniqueArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradingPosition that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradingPositionFindUniqueOrThrowArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradingPositionFindUniqueOrThrowArgs>(args: SelectSubset<T, TradingPositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingPosition that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionFindFirstArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradingPositionFindFirstArgs>(args?: SelectSubset<T, TradingPositionFindFirstArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradingPosition that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionFindFirstOrThrowArgs} args - Arguments to find a TradingPosition
     * @example
     * // Get one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradingPositionFindFirstOrThrowArgs>(args?: SelectSubset<T, TradingPositionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradingPositions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradingPositions
     * const tradingPositions = await prisma.tradingPosition.findMany()
     * 
     * // Get first 10 TradingPositions
     * const tradingPositions = await prisma.tradingPosition.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradingPositionWithIdOnly = await prisma.tradingPosition.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradingPositionFindManyArgs>(args?: SelectSubset<T, TradingPositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradingPosition.
     * @param {TradingPositionCreateArgs} args - Arguments to create a TradingPosition.
     * @example
     * // Create one TradingPosition
     * const TradingPosition = await prisma.tradingPosition.create({
     *   data: {
     *     // ... data to create a TradingPosition
     *   }
     * })
     * 
     */
    create<T extends TradingPositionCreateArgs>(args: SelectSubset<T, TradingPositionCreateArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradingPositions.
     * @param {TradingPositionCreateManyArgs} args - Arguments to create many TradingPositions.
     * @example
     * // Create many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradingPositionCreateManyArgs>(args?: SelectSubset<T, TradingPositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradingPositions and returns the data saved in the database.
     * @param {TradingPositionCreateManyAndReturnArgs} args - Arguments to create many TradingPositions.
     * @example
     * // Create many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradingPositions and only return the `id`
     * const tradingPositionWithIdOnly = await prisma.tradingPosition.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradingPositionCreateManyAndReturnArgs>(args?: SelectSubset<T, TradingPositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradingPosition.
     * @param {TradingPositionDeleteArgs} args - Arguments to delete one TradingPosition.
     * @example
     * // Delete one TradingPosition
     * const TradingPosition = await prisma.tradingPosition.delete({
     *   where: {
     *     // ... filter to delete one TradingPosition
     *   }
     * })
     * 
     */
    delete<T extends TradingPositionDeleteArgs>(args: SelectSubset<T, TradingPositionDeleteArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradingPosition.
     * @param {TradingPositionUpdateArgs} args - Arguments to update one TradingPosition.
     * @example
     * // Update one TradingPosition
     * const tradingPosition = await prisma.tradingPosition.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradingPositionUpdateArgs>(args: SelectSubset<T, TradingPositionUpdateArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradingPositions.
     * @param {TradingPositionDeleteManyArgs} args - Arguments to filter TradingPositions to delete.
     * @example
     * // Delete a few TradingPositions
     * const { count } = await prisma.tradingPosition.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradingPositionDeleteManyArgs>(args?: SelectSubset<T, TradingPositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingPositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradingPositionUpdateManyArgs>(args: SelectSubset<T, TradingPositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradingPositions and returns the data updated in the database.
     * @param {TradingPositionUpdateManyAndReturnArgs} args - Arguments to update many TradingPositions.
     * @example
     * // Update many TradingPositions
     * const tradingPosition = await prisma.tradingPosition.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradingPositions and only return the `id`
     * const tradingPositionWithIdOnly = await prisma.tradingPosition.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TradingPositionUpdateManyAndReturnArgs>(args: SelectSubset<T, TradingPositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradingPosition.
     * @param {TradingPositionUpsertArgs} args - Arguments to update or create a TradingPosition.
     * @example
     * // Update or create a TradingPosition
     * const tradingPosition = await prisma.tradingPosition.upsert({
     *   create: {
     *     // ... data to create a TradingPosition
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradingPosition we want to update
     *   }
     * })
     */
    upsert<T extends TradingPositionUpsertArgs>(args: SelectSubset<T, TradingPositionUpsertArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradingPositions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionCountArgs} args - Arguments to filter TradingPositions to count.
     * @example
     * // Count the number of TradingPositions
     * const count = await prisma.tradingPosition.count({
     *   where: {
     *     // ... the filter for the TradingPositions we want to count
     *   }
     * })
    **/
    count<T extends TradingPositionCountArgs>(
      args?: Subset<T, TradingPositionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradingPositionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradingPosition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradingPositionAggregateArgs>(args: Subset<T, TradingPositionAggregateArgs>): Prisma.PrismaPromise<GetTradingPositionAggregateType<T>>

    /**
     * Group by TradingPosition.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradingPositionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradingPositionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradingPositionGroupByArgs['orderBy'] }
        : { orderBy?: TradingPositionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradingPositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradingPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradingPosition model
   */
  readonly fields: TradingPositionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradingPosition.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradingPositionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    call<T extends TradingPosition$callArgs<ExtArgs> = {}>(args?: Subset<T, TradingPosition$callArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    trailingStops<T extends TradingPosition$trailingStopsArgs<ExtArgs> = {}>(args?: Subset<T, TradingPosition$trailingStopsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    tradeHistory<T extends TradingPosition$tradeHistoryArgs<ExtArgs> = {}>(args?: Subset<T, TradingPosition$tradeHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    priceAlerts<T extends TradingPosition$priceAlertsArgs<ExtArgs> = {}>(args?: Subset<T, TradingPosition$priceAlertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradingPosition model
   */
  interface TradingPositionFieldRefs {
    readonly id: FieldRef<"TradingPosition", 'String'>
    readonly userWalletAddress: FieldRef<"TradingPosition", 'String'>
    readonly tokenAddress: FieldRef<"TradingPosition", 'String'>
    readonly tokenSymbol: FieldRef<"TradingPosition", 'String'>
    readonly entryPrice: FieldRef<"TradingPosition", 'Decimal'>
    readonly entryAmountSol: FieldRef<"TradingPosition", 'Decimal'>
    readonly entryAmountTokens: FieldRef<"TradingPosition", 'Decimal'>
    readonly entryTxSignature: FieldRef<"TradingPosition", 'String'>
    readonly currentPrice: FieldRef<"TradingPosition", 'Decimal'>
    readonly currentValueSol: FieldRef<"TradingPosition", 'Decimal'>
    readonly highestPrice: FieldRef<"TradingPosition", 'Decimal'>
    readonly realizedPnlSol: FieldRef<"TradingPosition", 'Decimal'>
    readonly unrealizedPnlSol: FieldRef<"TradingPosition", 'Decimal'>
    readonly unrealizedPnlPercentage: FieldRef<"TradingPosition", 'Decimal'>
    readonly stopLossPrice: FieldRef<"TradingPosition", 'Decimal'>
    readonly takeProfitPrice: FieldRef<"TradingPosition", 'Decimal'>
    readonly trailingStopPercentage: FieldRef<"TradingPosition", 'Decimal'>
    readonly exitPrice: FieldRef<"TradingPosition", 'Decimal'>
    readonly exitAmountSol: FieldRef<"TradingPosition", 'Decimal'>
    readonly exitReason: FieldRef<"TradingPosition", 'String'>
    readonly exitTxSignature: FieldRef<"TradingPosition", 'String'>
    readonly status: FieldRef<"TradingPosition", 'String'>
    readonly openedAt: FieldRef<"TradingPosition", 'DateTime'>
    readonly closedAt: FieldRef<"TradingPosition", 'DateTime'>
    readonly lastUpdated: FieldRef<"TradingPosition", 'DateTime'>
    readonly callId: FieldRef<"TradingPosition", 'String'>
  }
    

  // Custom InputTypes
  /**
   * TradingPosition findUnique
   */
  export type TradingPositionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition findUniqueOrThrow
   */
  export type TradingPositionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition findFirst
   */
  export type TradingPositionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingPositions.
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPositions.
     */
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingPosition findFirstOrThrow
   */
  export type TradingPositionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPosition to fetch.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradingPositions.
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradingPositions.
     */
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingPosition findMany
   */
  export type TradingPositionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter, which TradingPositions to fetch.
     */
    where?: TradingPositionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradingPositions to fetch.
     */
    orderBy?: TradingPositionOrderByWithRelationInput | TradingPositionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradingPositions.
     */
    cursor?: TradingPositionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradingPositions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradingPositions.
     */
    skip?: number
    distinct?: TradingPositionScalarFieldEnum | TradingPositionScalarFieldEnum[]
  }

  /**
   * TradingPosition create
   */
  export type TradingPositionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * The data needed to create a TradingPosition.
     */
    data: XOR<TradingPositionCreateInput, TradingPositionUncheckedCreateInput>
  }

  /**
   * TradingPosition createMany
   */
  export type TradingPositionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradingPositions.
     */
    data: TradingPositionCreateManyInput | TradingPositionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradingPosition createManyAndReturn
   */
  export type TradingPositionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * The data used to create many TradingPositions.
     */
    data: TradingPositionCreateManyInput | TradingPositionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingPosition update
   */
  export type TradingPositionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * The data needed to update a TradingPosition.
     */
    data: XOR<TradingPositionUpdateInput, TradingPositionUncheckedUpdateInput>
    /**
     * Choose, which TradingPosition to update.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition updateMany
   */
  export type TradingPositionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradingPositions.
     */
    data: XOR<TradingPositionUpdateManyMutationInput, TradingPositionUncheckedUpdateManyInput>
    /**
     * Filter which TradingPositions to update
     */
    where?: TradingPositionWhereInput
    /**
     * Limit how many TradingPositions to update.
     */
    limit?: number
  }

  /**
   * TradingPosition updateManyAndReturn
   */
  export type TradingPositionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * The data used to update TradingPositions.
     */
    data: XOR<TradingPositionUpdateManyMutationInput, TradingPositionUncheckedUpdateManyInput>
    /**
     * Filter which TradingPositions to update
     */
    where?: TradingPositionWhereInput
    /**
     * Limit how many TradingPositions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradingPosition upsert
   */
  export type TradingPositionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * The filter to search for the TradingPosition to update in case it exists.
     */
    where: TradingPositionWhereUniqueInput
    /**
     * In case the TradingPosition found by the `where` argument doesn't exist, create a new TradingPosition with this data.
     */
    create: XOR<TradingPositionCreateInput, TradingPositionUncheckedCreateInput>
    /**
     * In case the TradingPosition was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradingPositionUpdateInput, TradingPositionUncheckedUpdateInput>
  }

  /**
   * TradingPosition delete
   */
  export type TradingPositionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    /**
     * Filter which TradingPosition to delete.
     */
    where: TradingPositionWhereUniqueInput
  }

  /**
   * TradingPosition deleteMany
   */
  export type TradingPositionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradingPositions to delete
     */
    where?: TradingPositionWhereInput
    /**
     * Limit how many TradingPositions to delete.
     */
    limit?: number
  }

  /**
   * TradingPosition.call
   */
  export type TradingPosition$callArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    where?: CallWhereInput
  }

  /**
   * TradingPosition.trailingStops
   */
  export type TradingPosition$trailingStopsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    where?: TrailingStopWhereInput
    orderBy?: TrailingStopOrderByWithRelationInput | TrailingStopOrderByWithRelationInput[]
    cursor?: TrailingStopWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TrailingStopScalarFieldEnum | TrailingStopScalarFieldEnum[]
  }

  /**
   * TradingPosition.tradeHistory
   */
  export type TradingPosition$tradeHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    where?: TradeHistoryWhereInput
    orderBy?: TradeHistoryOrderByWithRelationInput | TradeHistoryOrderByWithRelationInput[]
    cursor?: TradeHistoryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TradeHistoryScalarFieldEnum | TradeHistoryScalarFieldEnum[]
  }

  /**
   * TradingPosition.priceAlerts
   */
  export type TradingPosition$priceAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    where?: PriceAlertWhereInput
    orderBy?: PriceAlertOrderByWithRelationInput | PriceAlertOrderByWithRelationInput[]
    cursor?: PriceAlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PriceAlertScalarFieldEnum | PriceAlertScalarFieldEnum[]
  }

  /**
   * TradingPosition without action
   */
  export type TradingPositionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
  }


  /**
   * Model TrailingStop
   */

  export type AggregateTrailingStop = {
    _count: TrailingStopCountAggregateOutputType | null
    _avg: TrailingStopAvgAggregateOutputType | null
    _sum: TrailingStopSumAggregateOutputType | null
    _min: TrailingStopMinAggregateOutputType | null
    _max: TrailingStopMaxAggregateOutputType | null
  }

  export type TrailingStopAvgAggregateOutputType = {
    highestPrice: Decimal | null
    currentStopPrice: Decimal | null
    trailingPercentage: Decimal | null
  }

  export type TrailingStopSumAggregateOutputType = {
    highestPrice: Decimal | null
    currentStopPrice: Decimal | null
    trailingPercentage: Decimal | null
  }

  export type TrailingStopMinAggregateOutputType = {
    id: string | null
    positionId: string | null
    highestPrice: Decimal | null
    currentStopPrice: Decimal | null
    trailingPercentage: Decimal | null
    isActive: boolean | null
    lastCheckedAt: Date | null
    triggeredAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrailingStopMaxAggregateOutputType = {
    id: string | null
    positionId: string | null
    highestPrice: Decimal | null
    currentStopPrice: Decimal | null
    trailingPercentage: Decimal | null
    isActive: boolean | null
    lastCheckedAt: Date | null
    triggeredAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TrailingStopCountAggregateOutputType = {
    id: number
    positionId: number
    highestPrice: number
    currentStopPrice: number
    trailingPercentage: number
    isActive: number
    lastCheckedAt: number
    triggeredAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TrailingStopAvgAggregateInputType = {
    highestPrice?: true
    currentStopPrice?: true
    trailingPercentage?: true
  }

  export type TrailingStopSumAggregateInputType = {
    highestPrice?: true
    currentStopPrice?: true
    trailingPercentage?: true
  }

  export type TrailingStopMinAggregateInputType = {
    id?: true
    positionId?: true
    highestPrice?: true
    currentStopPrice?: true
    trailingPercentage?: true
    isActive?: true
    lastCheckedAt?: true
    triggeredAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrailingStopMaxAggregateInputType = {
    id?: true
    positionId?: true
    highestPrice?: true
    currentStopPrice?: true
    trailingPercentage?: true
    isActive?: true
    lastCheckedAt?: true
    triggeredAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TrailingStopCountAggregateInputType = {
    id?: true
    positionId?: true
    highestPrice?: true
    currentStopPrice?: true
    trailingPercentage?: true
    isActive?: true
    lastCheckedAt?: true
    triggeredAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TrailingStopAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrailingStop to aggregate.
     */
    where?: TrailingStopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrailingStops to fetch.
     */
    orderBy?: TrailingStopOrderByWithRelationInput | TrailingStopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TrailingStopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrailingStops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrailingStops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TrailingStops
    **/
    _count?: true | TrailingStopCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TrailingStopAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TrailingStopSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TrailingStopMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TrailingStopMaxAggregateInputType
  }

  export type GetTrailingStopAggregateType<T extends TrailingStopAggregateArgs> = {
        [P in keyof T & keyof AggregateTrailingStop]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTrailingStop[P]>
      : GetScalarType<T[P], AggregateTrailingStop[P]>
  }




  export type TrailingStopGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TrailingStopWhereInput
    orderBy?: TrailingStopOrderByWithAggregationInput | TrailingStopOrderByWithAggregationInput[]
    by: TrailingStopScalarFieldEnum[] | TrailingStopScalarFieldEnum
    having?: TrailingStopScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TrailingStopCountAggregateInputType | true
    _avg?: TrailingStopAvgAggregateInputType
    _sum?: TrailingStopSumAggregateInputType
    _min?: TrailingStopMinAggregateInputType
    _max?: TrailingStopMaxAggregateInputType
  }

  export type TrailingStopGroupByOutputType = {
    id: string
    positionId: string | null
    highestPrice: Decimal
    currentStopPrice: Decimal
    trailingPercentage: Decimal
    isActive: boolean
    lastCheckedAt: Date
    triggeredAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TrailingStopCountAggregateOutputType | null
    _avg: TrailingStopAvgAggregateOutputType | null
    _sum: TrailingStopSumAggregateOutputType | null
    _min: TrailingStopMinAggregateOutputType | null
    _max: TrailingStopMaxAggregateOutputType | null
  }

  type GetTrailingStopGroupByPayload<T extends TrailingStopGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TrailingStopGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TrailingStopGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TrailingStopGroupByOutputType[P]>
            : GetScalarType<T[P], TrailingStopGroupByOutputType[P]>
        }
      >
    >


  export type TrailingStopSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    highestPrice?: boolean
    currentStopPrice?: boolean
    trailingPercentage?: boolean
    isActive?: boolean
    lastCheckedAt?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    position?: boolean | TrailingStop$positionArgs<ExtArgs>
  }, ExtArgs["result"]["trailingStop"]>

  export type TrailingStopSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    highestPrice?: boolean
    currentStopPrice?: boolean
    trailingPercentage?: boolean
    isActive?: boolean
    lastCheckedAt?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    position?: boolean | TrailingStop$positionArgs<ExtArgs>
  }, ExtArgs["result"]["trailingStop"]>

  export type TrailingStopSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    highestPrice?: boolean
    currentStopPrice?: boolean
    trailingPercentage?: boolean
    isActive?: boolean
    lastCheckedAt?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    position?: boolean | TrailingStop$positionArgs<ExtArgs>
  }, ExtArgs["result"]["trailingStop"]>

  export type TrailingStopSelectScalar = {
    id?: boolean
    positionId?: boolean
    highestPrice?: boolean
    currentStopPrice?: boolean
    trailingPercentage?: boolean
    isActive?: boolean
    lastCheckedAt?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TrailingStopOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "positionId" | "highestPrice" | "currentStopPrice" | "trailingPercentage" | "isActive" | "lastCheckedAt" | "triggeredAt" | "createdAt" | "updatedAt", ExtArgs["result"]["trailingStop"]>
  export type TrailingStopInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | TrailingStop$positionArgs<ExtArgs>
  }
  export type TrailingStopIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | TrailingStop$positionArgs<ExtArgs>
  }
  export type TrailingStopIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | TrailingStop$positionArgs<ExtArgs>
  }

  export type $TrailingStopPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TrailingStop"
    objects: {
      position: Prisma.$TradingPositionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      positionId: string | null
      highestPrice: Prisma.Decimal
      currentStopPrice: Prisma.Decimal
      trailingPercentage: Prisma.Decimal
      isActive: boolean
      lastCheckedAt: Date
      triggeredAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["trailingStop"]>
    composites: {}
  }

  type TrailingStopGetPayload<S extends boolean | null | undefined | TrailingStopDefaultArgs> = $Result.GetResult<Prisma.$TrailingStopPayload, S>

  type TrailingStopCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TrailingStopFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TrailingStopCountAggregateInputType | true
    }

  export interface TrailingStopDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TrailingStop'], meta: { name: 'TrailingStop' } }
    /**
     * Find zero or one TrailingStop that matches the filter.
     * @param {TrailingStopFindUniqueArgs} args - Arguments to find a TrailingStop
     * @example
     * // Get one TrailingStop
     * const trailingStop = await prisma.trailingStop.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TrailingStopFindUniqueArgs>(args: SelectSubset<T, TrailingStopFindUniqueArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TrailingStop that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TrailingStopFindUniqueOrThrowArgs} args - Arguments to find a TrailingStop
     * @example
     * // Get one TrailingStop
     * const trailingStop = await prisma.trailingStop.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TrailingStopFindUniqueOrThrowArgs>(args: SelectSubset<T, TrailingStopFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrailingStop that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopFindFirstArgs} args - Arguments to find a TrailingStop
     * @example
     * // Get one TrailingStop
     * const trailingStop = await prisma.trailingStop.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TrailingStopFindFirstArgs>(args?: SelectSubset<T, TrailingStopFindFirstArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TrailingStop that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopFindFirstOrThrowArgs} args - Arguments to find a TrailingStop
     * @example
     * // Get one TrailingStop
     * const trailingStop = await prisma.trailingStop.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TrailingStopFindFirstOrThrowArgs>(args?: SelectSubset<T, TrailingStopFindFirstOrThrowArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TrailingStops that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TrailingStops
     * const trailingStops = await prisma.trailingStop.findMany()
     * 
     * // Get first 10 TrailingStops
     * const trailingStops = await prisma.trailingStop.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const trailingStopWithIdOnly = await prisma.trailingStop.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TrailingStopFindManyArgs>(args?: SelectSubset<T, TrailingStopFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TrailingStop.
     * @param {TrailingStopCreateArgs} args - Arguments to create a TrailingStop.
     * @example
     * // Create one TrailingStop
     * const TrailingStop = await prisma.trailingStop.create({
     *   data: {
     *     // ... data to create a TrailingStop
     *   }
     * })
     * 
     */
    create<T extends TrailingStopCreateArgs>(args: SelectSubset<T, TrailingStopCreateArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TrailingStops.
     * @param {TrailingStopCreateManyArgs} args - Arguments to create many TrailingStops.
     * @example
     * // Create many TrailingStops
     * const trailingStop = await prisma.trailingStop.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TrailingStopCreateManyArgs>(args?: SelectSubset<T, TrailingStopCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TrailingStops and returns the data saved in the database.
     * @param {TrailingStopCreateManyAndReturnArgs} args - Arguments to create many TrailingStops.
     * @example
     * // Create many TrailingStops
     * const trailingStop = await prisma.trailingStop.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TrailingStops and only return the `id`
     * const trailingStopWithIdOnly = await prisma.trailingStop.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TrailingStopCreateManyAndReturnArgs>(args?: SelectSubset<T, TrailingStopCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TrailingStop.
     * @param {TrailingStopDeleteArgs} args - Arguments to delete one TrailingStop.
     * @example
     * // Delete one TrailingStop
     * const TrailingStop = await prisma.trailingStop.delete({
     *   where: {
     *     // ... filter to delete one TrailingStop
     *   }
     * })
     * 
     */
    delete<T extends TrailingStopDeleteArgs>(args: SelectSubset<T, TrailingStopDeleteArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TrailingStop.
     * @param {TrailingStopUpdateArgs} args - Arguments to update one TrailingStop.
     * @example
     * // Update one TrailingStop
     * const trailingStop = await prisma.trailingStop.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TrailingStopUpdateArgs>(args: SelectSubset<T, TrailingStopUpdateArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TrailingStops.
     * @param {TrailingStopDeleteManyArgs} args - Arguments to filter TrailingStops to delete.
     * @example
     * // Delete a few TrailingStops
     * const { count } = await prisma.trailingStop.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TrailingStopDeleteManyArgs>(args?: SelectSubset<T, TrailingStopDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrailingStops.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TrailingStops
     * const trailingStop = await prisma.trailingStop.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TrailingStopUpdateManyArgs>(args: SelectSubset<T, TrailingStopUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TrailingStops and returns the data updated in the database.
     * @param {TrailingStopUpdateManyAndReturnArgs} args - Arguments to update many TrailingStops.
     * @example
     * // Update many TrailingStops
     * const trailingStop = await prisma.trailingStop.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TrailingStops and only return the `id`
     * const trailingStopWithIdOnly = await prisma.trailingStop.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TrailingStopUpdateManyAndReturnArgs>(args: SelectSubset<T, TrailingStopUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TrailingStop.
     * @param {TrailingStopUpsertArgs} args - Arguments to update or create a TrailingStop.
     * @example
     * // Update or create a TrailingStop
     * const trailingStop = await prisma.trailingStop.upsert({
     *   create: {
     *     // ... data to create a TrailingStop
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TrailingStop we want to update
     *   }
     * })
     */
    upsert<T extends TrailingStopUpsertArgs>(args: SelectSubset<T, TrailingStopUpsertArgs<ExtArgs>>): Prisma__TrailingStopClient<$Result.GetResult<Prisma.$TrailingStopPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TrailingStops.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopCountArgs} args - Arguments to filter TrailingStops to count.
     * @example
     * // Count the number of TrailingStops
     * const count = await prisma.trailingStop.count({
     *   where: {
     *     // ... the filter for the TrailingStops we want to count
     *   }
     * })
    **/
    count<T extends TrailingStopCountArgs>(
      args?: Subset<T, TrailingStopCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TrailingStopCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TrailingStop.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TrailingStopAggregateArgs>(args: Subset<T, TrailingStopAggregateArgs>): Prisma.PrismaPromise<GetTrailingStopAggregateType<T>>

    /**
     * Group by TrailingStop.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TrailingStopGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TrailingStopGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TrailingStopGroupByArgs['orderBy'] }
        : { orderBy?: TrailingStopGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TrailingStopGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrailingStopGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TrailingStop model
   */
  readonly fields: TrailingStopFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TrailingStop.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TrailingStopClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    position<T extends TrailingStop$positionArgs<ExtArgs> = {}>(args?: Subset<T, TrailingStop$positionArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TrailingStop model
   */
  interface TrailingStopFieldRefs {
    readonly id: FieldRef<"TrailingStop", 'String'>
    readonly positionId: FieldRef<"TrailingStop", 'String'>
    readonly highestPrice: FieldRef<"TrailingStop", 'Decimal'>
    readonly currentStopPrice: FieldRef<"TrailingStop", 'Decimal'>
    readonly trailingPercentage: FieldRef<"TrailingStop", 'Decimal'>
    readonly isActive: FieldRef<"TrailingStop", 'Boolean'>
    readonly lastCheckedAt: FieldRef<"TrailingStop", 'DateTime'>
    readonly triggeredAt: FieldRef<"TrailingStop", 'DateTime'>
    readonly createdAt: FieldRef<"TrailingStop", 'DateTime'>
    readonly updatedAt: FieldRef<"TrailingStop", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TrailingStop findUnique
   */
  export type TrailingStopFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * Filter, which TrailingStop to fetch.
     */
    where: TrailingStopWhereUniqueInput
  }

  /**
   * TrailingStop findUniqueOrThrow
   */
  export type TrailingStopFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * Filter, which TrailingStop to fetch.
     */
    where: TrailingStopWhereUniqueInput
  }

  /**
   * TrailingStop findFirst
   */
  export type TrailingStopFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * Filter, which TrailingStop to fetch.
     */
    where?: TrailingStopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrailingStops to fetch.
     */
    orderBy?: TrailingStopOrderByWithRelationInput | TrailingStopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrailingStops.
     */
    cursor?: TrailingStopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrailingStops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrailingStops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrailingStops.
     */
    distinct?: TrailingStopScalarFieldEnum | TrailingStopScalarFieldEnum[]
  }

  /**
   * TrailingStop findFirstOrThrow
   */
  export type TrailingStopFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * Filter, which TrailingStop to fetch.
     */
    where?: TrailingStopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrailingStops to fetch.
     */
    orderBy?: TrailingStopOrderByWithRelationInput | TrailingStopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TrailingStops.
     */
    cursor?: TrailingStopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrailingStops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrailingStops.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TrailingStops.
     */
    distinct?: TrailingStopScalarFieldEnum | TrailingStopScalarFieldEnum[]
  }

  /**
   * TrailingStop findMany
   */
  export type TrailingStopFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * Filter, which TrailingStops to fetch.
     */
    where?: TrailingStopWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TrailingStops to fetch.
     */
    orderBy?: TrailingStopOrderByWithRelationInput | TrailingStopOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TrailingStops.
     */
    cursor?: TrailingStopWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TrailingStops from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TrailingStops.
     */
    skip?: number
    distinct?: TrailingStopScalarFieldEnum | TrailingStopScalarFieldEnum[]
  }

  /**
   * TrailingStop create
   */
  export type TrailingStopCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * The data needed to create a TrailingStop.
     */
    data: XOR<TrailingStopCreateInput, TrailingStopUncheckedCreateInput>
  }

  /**
   * TrailingStop createMany
   */
  export type TrailingStopCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TrailingStops.
     */
    data: TrailingStopCreateManyInput | TrailingStopCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TrailingStop createManyAndReturn
   */
  export type TrailingStopCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * The data used to create many TrailingStops.
     */
    data: TrailingStopCreateManyInput | TrailingStopCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrailingStop update
   */
  export type TrailingStopUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * The data needed to update a TrailingStop.
     */
    data: XOR<TrailingStopUpdateInput, TrailingStopUncheckedUpdateInput>
    /**
     * Choose, which TrailingStop to update.
     */
    where: TrailingStopWhereUniqueInput
  }

  /**
   * TrailingStop updateMany
   */
  export type TrailingStopUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TrailingStops.
     */
    data: XOR<TrailingStopUpdateManyMutationInput, TrailingStopUncheckedUpdateManyInput>
    /**
     * Filter which TrailingStops to update
     */
    where?: TrailingStopWhereInput
    /**
     * Limit how many TrailingStops to update.
     */
    limit?: number
  }

  /**
   * TrailingStop updateManyAndReturn
   */
  export type TrailingStopUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * The data used to update TrailingStops.
     */
    data: XOR<TrailingStopUpdateManyMutationInput, TrailingStopUncheckedUpdateManyInput>
    /**
     * Filter which TrailingStops to update
     */
    where?: TrailingStopWhereInput
    /**
     * Limit how many TrailingStops to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TrailingStop upsert
   */
  export type TrailingStopUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * The filter to search for the TrailingStop to update in case it exists.
     */
    where: TrailingStopWhereUniqueInput
    /**
     * In case the TrailingStop found by the `where` argument doesn't exist, create a new TrailingStop with this data.
     */
    create: XOR<TrailingStopCreateInput, TrailingStopUncheckedCreateInput>
    /**
     * In case the TrailingStop was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TrailingStopUpdateInput, TrailingStopUncheckedUpdateInput>
  }

  /**
   * TrailingStop delete
   */
  export type TrailingStopDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
    /**
     * Filter which TrailingStop to delete.
     */
    where: TrailingStopWhereUniqueInput
  }

  /**
   * TrailingStop deleteMany
   */
  export type TrailingStopDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TrailingStops to delete
     */
    where?: TrailingStopWhereInput
    /**
     * Limit how many TrailingStops to delete.
     */
    limit?: number
  }

  /**
   * TrailingStop.position
   */
  export type TrailingStop$positionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    where?: TradingPositionWhereInput
  }

  /**
   * TrailingStop without action
   */
  export type TrailingStopDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TrailingStop
     */
    select?: TrailingStopSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TrailingStop
     */
    omit?: TrailingStopOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TrailingStopInclude<ExtArgs> | null
  }


  /**
   * Model UserTradingConfig
   */

  export type AggregateUserTradingConfig = {
    _count: UserTradingConfigCountAggregateOutputType | null
    _avg: UserTradingConfigAvgAggregateOutputType | null
    _sum: UserTradingConfigSumAggregateOutputType | null
    _min: UserTradingConfigMinAggregateOutputType | null
    _max: UserTradingConfigMaxAggregateOutputType | null
  }

  export type UserTradingConfigAvgAggregateOutputType = {
    defaultBuyAmountSol: Decimal | null
    maxPositionSizeSol: Decimal | null
    defaultSlippageBps: number | null
    maxSlippageBps: number | null
    trailingStopPercentage: Decimal | null
  }

  export type UserTradingConfigSumAggregateOutputType = {
    defaultBuyAmountSol: Decimal | null
    maxPositionSizeSol: Decimal | null
    defaultSlippageBps: number | null
    maxSlippageBps: number | null
    trailingStopPercentage: Decimal | null
  }

  export type UserTradingConfigMinAggregateOutputType = {
    id: string | null
    userWalletAddress: string | null
    telegramUserId: string | null
    isAutoBuyEnabled: boolean | null
    defaultBuyAmountSol: Decimal | null
    maxPositionSizeSol: Decimal | null
    defaultSlippageBps: number | null
    maxSlippageBps: number | null
    trailingStopEnabled: boolean | null
    trailingStopPercentage: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserTradingConfigMaxAggregateOutputType = {
    id: string | null
    userWalletAddress: string | null
    telegramUserId: string | null
    isAutoBuyEnabled: boolean | null
    defaultBuyAmountSol: Decimal | null
    maxPositionSizeSol: Decimal | null
    defaultSlippageBps: number | null
    maxSlippageBps: number | null
    trailingStopEnabled: boolean | null
    trailingStopPercentage: Decimal | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserTradingConfigCountAggregateOutputType = {
    id: number
    userWalletAddress: number
    telegramUserId: number
    isAutoBuyEnabled: number
    defaultBuyAmountSol: number
    maxPositionSizeSol: number
    defaultSlippageBps: number
    maxSlippageBps: number
    trailingStopEnabled: number
    trailingStopPercentage: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserTradingConfigAvgAggregateInputType = {
    defaultBuyAmountSol?: true
    maxPositionSizeSol?: true
    defaultSlippageBps?: true
    maxSlippageBps?: true
    trailingStopPercentage?: true
  }

  export type UserTradingConfigSumAggregateInputType = {
    defaultBuyAmountSol?: true
    maxPositionSizeSol?: true
    defaultSlippageBps?: true
    maxSlippageBps?: true
    trailingStopPercentage?: true
  }

  export type UserTradingConfigMinAggregateInputType = {
    id?: true
    userWalletAddress?: true
    telegramUserId?: true
    isAutoBuyEnabled?: true
    defaultBuyAmountSol?: true
    maxPositionSizeSol?: true
    defaultSlippageBps?: true
    maxSlippageBps?: true
    trailingStopEnabled?: true
    trailingStopPercentage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserTradingConfigMaxAggregateInputType = {
    id?: true
    userWalletAddress?: true
    telegramUserId?: true
    isAutoBuyEnabled?: true
    defaultBuyAmountSol?: true
    maxPositionSizeSol?: true
    defaultSlippageBps?: true
    maxSlippageBps?: true
    trailingStopEnabled?: true
    trailingStopPercentage?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserTradingConfigCountAggregateInputType = {
    id?: true
    userWalletAddress?: true
    telegramUserId?: true
    isAutoBuyEnabled?: true
    defaultBuyAmountSol?: true
    maxPositionSizeSol?: true
    defaultSlippageBps?: true
    maxSlippageBps?: true
    trailingStopEnabled?: true
    trailingStopPercentage?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserTradingConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserTradingConfig to aggregate.
     */
    where?: UserTradingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTradingConfigs to fetch.
     */
    orderBy?: UserTradingConfigOrderByWithRelationInput | UserTradingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserTradingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTradingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTradingConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserTradingConfigs
    **/
    _count?: true | UserTradingConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserTradingConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserTradingConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserTradingConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserTradingConfigMaxAggregateInputType
  }

  export type GetUserTradingConfigAggregateType<T extends UserTradingConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateUserTradingConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserTradingConfig[P]>
      : GetScalarType<T[P], AggregateUserTradingConfig[P]>
  }




  export type UserTradingConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserTradingConfigWhereInput
    orderBy?: UserTradingConfigOrderByWithAggregationInput | UserTradingConfigOrderByWithAggregationInput[]
    by: UserTradingConfigScalarFieldEnum[] | UserTradingConfigScalarFieldEnum
    having?: UserTradingConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserTradingConfigCountAggregateInputType | true
    _avg?: UserTradingConfigAvgAggregateInputType
    _sum?: UserTradingConfigSumAggregateInputType
    _min?: UserTradingConfigMinAggregateInputType
    _max?: UserTradingConfigMaxAggregateInputType
  }

  export type UserTradingConfigGroupByOutputType = {
    id: string
    userWalletAddress: string
    telegramUserId: string | null
    isAutoBuyEnabled: boolean
    defaultBuyAmountSol: Decimal
    maxPositionSizeSol: Decimal
    defaultSlippageBps: number
    maxSlippageBps: number
    trailingStopEnabled: boolean
    trailingStopPercentage: Decimal
    createdAt: Date
    updatedAt: Date
    _count: UserTradingConfigCountAggregateOutputType | null
    _avg: UserTradingConfigAvgAggregateOutputType | null
    _sum: UserTradingConfigSumAggregateOutputType | null
    _min: UserTradingConfigMinAggregateOutputType | null
    _max: UserTradingConfigMaxAggregateOutputType | null
  }

  type GetUserTradingConfigGroupByPayload<T extends UserTradingConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserTradingConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserTradingConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserTradingConfigGroupByOutputType[P]>
            : GetScalarType<T[P], UserTradingConfigGroupByOutputType[P]>
        }
      >
    >


  export type UserTradingConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    telegramUserId?: boolean
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: boolean
    maxPositionSizeSol?: boolean
    defaultSlippageBps?: boolean
    maxSlippageBps?: boolean
    trailingStopEnabled?: boolean
    trailingStopPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userTradingConfig"]>

  export type UserTradingConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    telegramUserId?: boolean
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: boolean
    maxPositionSizeSol?: boolean
    defaultSlippageBps?: boolean
    maxSlippageBps?: boolean
    trailingStopEnabled?: boolean
    trailingStopPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userTradingConfig"]>

  export type UserTradingConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    telegramUserId?: boolean
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: boolean
    maxPositionSizeSol?: boolean
    defaultSlippageBps?: boolean
    maxSlippageBps?: boolean
    trailingStopEnabled?: boolean
    trailingStopPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userTradingConfig"]>

  export type UserTradingConfigSelectScalar = {
    id?: boolean
    userWalletAddress?: boolean
    telegramUserId?: boolean
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: boolean
    maxPositionSizeSol?: boolean
    defaultSlippageBps?: boolean
    maxSlippageBps?: boolean
    trailingStopEnabled?: boolean
    trailingStopPercentage?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserTradingConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userWalletAddress" | "telegramUserId" | "isAutoBuyEnabled" | "defaultBuyAmountSol" | "maxPositionSizeSol" | "defaultSlippageBps" | "maxSlippageBps" | "trailingStopEnabled" | "trailingStopPercentage" | "createdAt" | "updatedAt", ExtArgs["result"]["userTradingConfig"]>

  export type $UserTradingConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserTradingConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userWalletAddress: string
      telegramUserId: string | null
      isAutoBuyEnabled: boolean
      defaultBuyAmountSol: Prisma.Decimal
      maxPositionSizeSol: Prisma.Decimal
      defaultSlippageBps: number
      maxSlippageBps: number
      trailingStopEnabled: boolean
      trailingStopPercentage: Prisma.Decimal
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userTradingConfig"]>
    composites: {}
  }

  type UserTradingConfigGetPayload<S extends boolean | null | undefined | UserTradingConfigDefaultArgs> = $Result.GetResult<Prisma.$UserTradingConfigPayload, S>

  type UserTradingConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserTradingConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserTradingConfigCountAggregateInputType | true
    }

  export interface UserTradingConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserTradingConfig'], meta: { name: 'UserTradingConfig' } }
    /**
     * Find zero or one UserTradingConfig that matches the filter.
     * @param {UserTradingConfigFindUniqueArgs} args - Arguments to find a UserTradingConfig
     * @example
     * // Get one UserTradingConfig
     * const userTradingConfig = await prisma.userTradingConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserTradingConfigFindUniqueArgs>(args: SelectSubset<T, UserTradingConfigFindUniqueArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserTradingConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserTradingConfigFindUniqueOrThrowArgs} args - Arguments to find a UserTradingConfig
     * @example
     * // Get one UserTradingConfig
     * const userTradingConfig = await prisma.userTradingConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserTradingConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, UserTradingConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserTradingConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigFindFirstArgs} args - Arguments to find a UserTradingConfig
     * @example
     * // Get one UserTradingConfig
     * const userTradingConfig = await prisma.userTradingConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserTradingConfigFindFirstArgs>(args?: SelectSubset<T, UserTradingConfigFindFirstArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserTradingConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigFindFirstOrThrowArgs} args - Arguments to find a UserTradingConfig
     * @example
     * // Get one UserTradingConfig
     * const userTradingConfig = await prisma.userTradingConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserTradingConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, UserTradingConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserTradingConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserTradingConfigs
     * const userTradingConfigs = await prisma.userTradingConfig.findMany()
     * 
     * // Get first 10 UserTradingConfigs
     * const userTradingConfigs = await prisma.userTradingConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userTradingConfigWithIdOnly = await prisma.userTradingConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserTradingConfigFindManyArgs>(args?: SelectSubset<T, UserTradingConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserTradingConfig.
     * @param {UserTradingConfigCreateArgs} args - Arguments to create a UserTradingConfig.
     * @example
     * // Create one UserTradingConfig
     * const UserTradingConfig = await prisma.userTradingConfig.create({
     *   data: {
     *     // ... data to create a UserTradingConfig
     *   }
     * })
     * 
     */
    create<T extends UserTradingConfigCreateArgs>(args: SelectSubset<T, UserTradingConfigCreateArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserTradingConfigs.
     * @param {UserTradingConfigCreateManyArgs} args - Arguments to create many UserTradingConfigs.
     * @example
     * // Create many UserTradingConfigs
     * const userTradingConfig = await prisma.userTradingConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserTradingConfigCreateManyArgs>(args?: SelectSubset<T, UserTradingConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserTradingConfigs and returns the data saved in the database.
     * @param {UserTradingConfigCreateManyAndReturnArgs} args - Arguments to create many UserTradingConfigs.
     * @example
     * // Create many UserTradingConfigs
     * const userTradingConfig = await prisma.userTradingConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserTradingConfigs and only return the `id`
     * const userTradingConfigWithIdOnly = await prisma.userTradingConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserTradingConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, UserTradingConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserTradingConfig.
     * @param {UserTradingConfigDeleteArgs} args - Arguments to delete one UserTradingConfig.
     * @example
     * // Delete one UserTradingConfig
     * const UserTradingConfig = await prisma.userTradingConfig.delete({
     *   where: {
     *     // ... filter to delete one UserTradingConfig
     *   }
     * })
     * 
     */
    delete<T extends UserTradingConfigDeleteArgs>(args: SelectSubset<T, UserTradingConfigDeleteArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserTradingConfig.
     * @param {UserTradingConfigUpdateArgs} args - Arguments to update one UserTradingConfig.
     * @example
     * // Update one UserTradingConfig
     * const userTradingConfig = await prisma.userTradingConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserTradingConfigUpdateArgs>(args: SelectSubset<T, UserTradingConfigUpdateArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserTradingConfigs.
     * @param {UserTradingConfigDeleteManyArgs} args - Arguments to filter UserTradingConfigs to delete.
     * @example
     * // Delete a few UserTradingConfigs
     * const { count } = await prisma.userTradingConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserTradingConfigDeleteManyArgs>(args?: SelectSubset<T, UserTradingConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserTradingConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserTradingConfigs
     * const userTradingConfig = await prisma.userTradingConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserTradingConfigUpdateManyArgs>(args: SelectSubset<T, UserTradingConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserTradingConfigs and returns the data updated in the database.
     * @param {UserTradingConfigUpdateManyAndReturnArgs} args - Arguments to update many UserTradingConfigs.
     * @example
     * // Update many UserTradingConfigs
     * const userTradingConfig = await prisma.userTradingConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserTradingConfigs and only return the `id`
     * const userTradingConfigWithIdOnly = await prisma.userTradingConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserTradingConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, UserTradingConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserTradingConfig.
     * @param {UserTradingConfigUpsertArgs} args - Arguments to update or create a UserTradingConfig.
     * @example
     * // Update or create a UserTradingConfig
     * const userTradingConfig = await prisma.userTradingConfig.upsert({
     *   create: {
     *     // ... data to create a UserTradingConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserTradingConfig we want to update
     *   }
     * })
     */
    upsert<T extends UserTradingConfigUpsertArgs>(args: SelectSubset<T, UserTradingConfigUpsertArgs<ExtArgs>>): Prisma__UserTradingConfigClient<$Result.GetResult<Prisma.$UserTradingConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserTradingConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigCountArgs} args - Arguments to filter UserTradingConfigs to count.
     * @example
     * // Count the number of UserTradingConfigs
     * const count = await prisma.userTradingConfig.count({
     *   where: {
     *     // ... the filter for the UserTradingConfigs we want to count
     *   }
     * })
    **/
    count<T extends UserTradingConfigCountArgs>(
      args?: Subset<T, UserTradingConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserTradingConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserTradingConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserTradingConfigAggregateArgs>(args: Subset<T, UserTradingConfigAggregateArgs>): Prisma.PrismaPromise<GetUserTradingConfigAggregateType<T>>

    /**
     * Group by UserTradingConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserTradingConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserTradingConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserTradingConfigGroupByArgs['orderBy'] }
        : { orderBy?: UserTradingConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserTradingConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserTradingConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserTradingConfig model
   */
  readonly fields: UserTradingConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserTradingConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserTradingConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserTradingConfig model
   */
  interface UserTradingConfigFieldRefs {
    readonly id: FieldRef<"UserTradingConfig", 'String'>
    readonly userWalletAddress: FieldRef<"UserTradingConfig", 'String'>
    readonly telegramUserId: FieldRef<"UserTradingConfig", 'String'>
    readonly isAutoBuyEnabled: FieldRef<"UserTradingConfig", 'Boolean'>
    readonly defaultBuyAmountSol: FieldRef<"UserTradingConfig", 'Decimal'>
    readonly maxPositionSizeSol: FieldRef<"UserTradingConfig", 'Decimal'>
    readonly defaultSlippageBps: FieldRef<"UserTradingConfig", 'Int'>
    readonly maxSlippageBps: FieldRef<"UserTradingConfig", 'Int'>
    readonly trailingStopEnabled: FieldRef<"UserTradingConfig", 'Boolean'>
    readonly trailingStopPercentage: FieldRef<"UserTradingConfig", 'Decimal'>
    readonly createdAt: FieldRef<"UserTradingConfig", 'DateTime'>
    readonly updatedAt: FieldRef<"UserTradingConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserTradingConfig findUnique
   */
  export type UserTradingConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * Filter, which UserTradingConfig to fetch.
     */
    where: UserTradingConfigWhereUniqueInput
  }

  /**
   * UserTradingConfig findUniqueOrThrow
   */
  export type UserTradingConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * Filter, which UserTradingConfig to fetch.
     */
    where: UserTradingConfigWhereUniqueInput
  }

  /**
   * UserTradingConfig findFirst
   */
  export type UserTradingConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * Filter, which UserTradingConfig to fetch.
     */
    where?: UserTradingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTradingConfigs to fetch.
     */
    orderBy?: UserTradingConfigOrderByWithRelationInput | UserTradingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserTradingConfigs.
     */
    cursor?: UserTradingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTradingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTradingConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserTradingConfigs.
     */
    distinct?: UserTradingConfigScalarFieldEnum | UserTradingConfigScalarFieldEnum[]
  }

  /**
   * UserTradingConfig findFirstOrThrow
   */
  export type UserTradingConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * Filter, which UserTradingConfig to fetch.
     */
    where?: UserTradingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTradingConfigs to fetch.
     */
    orderBy?: UserTradingConfigOrderByWithRelationInput | UserTradingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserTradingConfigs.
     */
    cursor?: UserTradingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTradingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTradingConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserTradingConfigs.
     */
    distinct?: UserTradingConfigScalarFieldEnum | UserTradingConfigScalarFieldEnum[]
  }

  /**
   * UserTradingConfig findMany
   */
  export type UserTradingConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * Filter, which UserTradingConfigs to fetch.
     */
    where?: UserTradingConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserTradingConfigs to fetch.
     */
    orderBy?: UserTradingConfigOrderByWithRelationInput | UserTradingConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserTradingConfigs.
     */
    cursor?: UserTradingConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserTradingConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserTradingConfigs.
     */
    skip?: number
    distinct?: UserTradingConfigScalarFieldEnum | UserTradingConfigScalarFieldEnum[]
  }

  /**
   * UserTradingConfig create
   */
  export type UserTradingConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a UserTradingConfig.
     */
    data: XOR<UserTradingConfigCreateInput, UserTradingConfigUncheckedCreateInput>
  }

  /**
   * UserTradingConfig createMany
   */
  export type UserTradingConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserTradingConfigs.
     */
    data: UserTradingConfigCreateManyInput | UserTradingConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserTradingConfig createManyAndReturn
   */
  export type UserTradingConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * The data used to create many UserTradingConfigs.
     */
    data: UserTradingConfigCreateManyInput | UserTradingConfigCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UserTradingConfig update
   */
  export type UserTradingConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a UserTradingConfig.
     */
    data: XOR<UserTradingConfigUpdateInput, UserTradingConfigUncheckedUpdateInput>
    /**
     * Choose, which UserTradingConfig to update.
     */
    where: UserTradingConfigWhereUniqueInput
  }

  /**
   * UserTradingConfig updateMany
   */
  export type UserTradingConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserTradingConfigs.
     */
    data: XOR<UserTradingConfigUpdateManyMutationInput, UserTradingConfigUncheckedUpdateManyInput>
    /**
     * Filter which UserTradingConfigs to update
     */
    where?: UserTradingConfigWhereInput
    /**
     * Limit how many UserTradingConfigs to update.
     */
    limit?: number
  }

  /**
   * UserTradingConfig updateManyAndReturn
   */
  export type UserTradingConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * The data used to update UserTradingConfigs.
     */
    data: XOR<UserTradingConfigUpdateManyMutationInput, UserTradingConfigUncheckedUpdateManyInput>
    /**
     * Filter which UserTradingConfigs to update
     */
    where?: UserTradingConfigWhereInput
    /**
     * Limit how many UserTradingConfigs to update.
     */
    limit?: number
  }

  /**
   * UserTradingConfig upsert
   */
  export type UserTradingConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the UserTradingConfig to update in case it exists.
     */
    where: UserTradingConfigWhereUniqueInput
    /**
     * In case the UserTradingConfig found by the `where` argument doesn't exist, create a new UserTradingConfig with this data.
     */
    create: XOR<UserTradingConfigCreateInput, UserTradingConfigUncheckedCreateInput>
    /**
     * In case the UserTradingConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserTradingConfigUpdateInput, UserTradingConfigUncheckedUpdateInput>
  }

  /**
   * UserTradingConfig delete
   */
  export type UserTradingConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
    /**
     * Filter which UserTradingConfig to delete.
     */
    where: UserTradingConfigWhereUniqueInput
  }

  /**
   * UserTradingConfig deleteMany
   */
  export type UserTradingConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserTradingConfigs to delete
     */
    where?: UserTradingConfigWhereInput
    /**
     * Limit how many UserTradingConfigs to delete.
     */
    limit?: number
  }

  /**
   * UserTradingConfig without action
   */
  export type UserTradingConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserTradingConfig
     */
    select?: UserTradingConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserTradingConfig
     */
    omit?: UserTradingConfigOmit<ExtArgs> | null
  }


  /**
   * Model AutoBuyQueue
   */

  export type AggregateAutoBuyQueue = {
    _count: AutoBuyQueueCountAggregateOutputType | null
    _avg: AutoBuyQueueAvgAggregateOutputType | null
    _sum: AutoBuyQueueSumAggregateOutputType | null
    _min: AutoBuyQueueMinAggregateOutputType | null
    _max: AutoBuyQueueMaxAggregateOutputType | null
  }

  export type AutoBuyQueueAvgAggregateOutputType = {
    buyAmountSol: Decimal | null
    maxPrice: Decimal | null
    slippageBps: number | null
  }

  export type AutoBuyQueueSumAggregateOutputType = {
    buyAmountSol: Decimal | null
    maxPrice: Decimal | null
    slippageBps: number | null
  }

  export type AutoBuyQueueMinAggregateOutputType = {
    id: string | null
    userWalletAddress: string | null
    callId: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    buyAmountSol: Decimal | null
    maxPrice: Decimal | null
    slippageBps: number | null
    status: string | null
    errorMessage: string | null
    tradeId: string | null
    createdAt: Date | null
    processedAt: Date | null
  }

  export type AutoBuyQueueMaxAggregateOutputType = {
    id: string | null
    userWalletAddress: string | null
    callId: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    buyAmountSol: Decimal | null
    maxPrice: Decimal | null
    slippageBps: number | null
    status: string | null
    errorMessage: string | null
    tradeId: string | null
    createdAt: Date | null
    processedAt: Date | null
  }

  export type AutoBuyQueueCountAggregateOutputType = {
    id: number
    userWalletAddress: number
    callId: number
    tokenAddress: number
    tokenSymbol: number
    buyAmountSol: number
    maxPrice: number
    slippageBps: number
    status: number
    errorMessage: number
    tradeId: number
    createdAt: number
    processedAt: number
    _all: number
  }


  export type AutoBuyQueueAvgAggregateInputType = {
    buyAmountSol?: true
    maxPrice?: true
    slippageBps?: true
  }

  export type AutoBuyQueueSumAggregateInputType = {
    buyAmountSol?: true
    maxPrice?: true
    slippageBps?: true
  }

  export type AutoBuyQueueMinAggregateInputType = {
    id?: true
    userWalletAddress?: true
    callId?: true
    tokenAddress?: true
    tokenSymbol?: true
    buyAmountSol?: true
    maxPrice?: true
    slippageBps?: true
    status?: true
    errorMessage?: true
    tradeId?: true
    createdAt?: true
    processedAt?: true
  }

  export type AutoBuyQueueMaxAggregateInputType = {
    id?: true
    userWalletAddress?: true
    callId?: true
    tokenAddress?: true
    tokenSymbol?: true
    buyAmountSol?: true
    maxPrice?: true
    slippageBps?: true
    status?: true
    errorMessage?: true
    tradeId?: true
    createdAt?: true
    processedAt?: true
  }

  export type AutoBuyQueueCountAggregateInputType = {
    id?: true
    userWalletAddress?: true
    callId?: true
    tokenAddress?: true
    tokenSymbol?: true
    buyAmountSol?: true
    maxPrice?: true
    slippageBps?: true
    status?: true
    errorMessage?: true
    tradeId?: true
    createdAt?: true
    processedAt?: true
    _all?: true
  }

  export type AutoBuyQueueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutoBuyQueue to aggregate.
     */
    where?: AutoBuyQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutoBuyQueues to fetch.
     */
    orderBy?: AutoBuyQueueOrderByWithRelationInput | AutoBuyQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AutoBuyQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutoBuyQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutoBuyQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AutoBuyQueues
    **/
    _count?: true | AutoBuyQueueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AutoBuyQueueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AutoBuyQueueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AutoBuyQueueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AutoBuyQueueMaxAggregateInputType
  }

  export type GetAutoBuyQueueAggregateType<T extends AutoBuyQueueAggregateArgs> = {
        [P in keyof T & keyof AggregateAutoBuyQueue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAutoBuyQueue[P]>
      : GetScalarType<T[P], AggregateAutoBuyQueue[P]>
  }




  export type AutoBuyQueueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AutoBuyQueueWhereInput
    orderBy?: AutoBuyQueueOrderByWithAggregationInput | AutoBuyQueueOrderByWithAggregationInput[]
    by: AutoBuyQueueScalarFieldEnum[] | AutoBuyQueueScalarFieldEnum
    having?: AutoBuyQueueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AutoBuyQueueCountAggregateInputType | true
    _avg?: AutoBuyQueueAvgAggregateInputType
    _sum?: AutoBuyQueueSumAggregateInputType
    _min?: AutoBuyQueueMinAggregateInputType
    _max?: AutoBuyQueueMaxAggregateInputType
  }

  export type AutoBuyQueueGroupByOutputType = {
    id: string
    userWalletAddress: string
    callId: string | null
    tokenAddress: string | null
    tokenSymbol: string
    buyAmountSol: Decimal
    maxPrice: Decimal | null
    slippageBps: number | null
    status: string
    errorMessage: string | null
    tradeId: string | null
    createdAt: Date
    processedAt: Date | null
    _count: AutoBuyQueueCountAggregateOutputType | null
    _avg: AutoBuyQueueAvgAggregateOutputType | null
    _sum: AutoBuyQueueSumAggregateOutputType | null
    _min: AutoBuyQueueMinAggregateOutputType | null
    _max: AutoBuyQueueMaxAggregateOutputType | null
  }

  type GetAutoBuyQueueGroupByPayload<T extends AutoBuyQueueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AutoBuyQueueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AutoBuyQueueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AutoBuyQueueGroupByOutputType[P]>
            : GetScalarType<T[P], AutoBuyQueueGroupByOutputType[P]>
        }
      >
    >


  export type AutoBuyQueueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    callId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    buyAmountSol?: boolean
    maxPrice?: boolean
    slippageBps?: boolean
    status?: boolean
    errorMessage?: boolean
    tradeId?: boolean
    createdAt?: boolean
    processedAt?: boolean
    call?: boolean | AutoBuyQueue$callArgs<ExtArgs>
    trade?: boolean | AutoBuyQueue$tradeArgs<ExtArgs>
  }, ExtArgs["result"]["autoBuyQueue"]>

  export type AutoBuyQueueSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    callId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    buyAmountSol?: boolean
    maxPrice?: boolean
    slippageBps?: boolean
    status?: boolean
    errorMessage?: boolean
    tradeId?: boolean
    createdAt?: boolean
    processedAt?: boolean
    call?: boolean | AutoBuyQueue$callArgs<ExtArgs>
    trade?: boolean | AutoBuyQueue$tradeArgs<ExtArgs>
  }, ExtArgs["result"]["autoBuyQueue"]>

  export type AutoBuyQueueSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userWalletAddress?: boolean
    callId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    buyAmountSol?: boolean
    maxPrice?: boolean
    slippageBps?: boolean
    status?: boolean
    errorMessage?: boolean
    tradeId?: boolean
    createdAt?: boolean
    processedAt?: boolean
    call?: boolean | AutoBuyQueue$callArgs<ExtArgs>
    trade?: boolean | AutoBuyQueue$tradeArgs<ExtArgs>
  }, ExtArgs["result"]["autoBuyQueue"]>

  export type AutoBuyQueueSelectScalar = {
    id?: boolean
    userWalletAddress?: boolean
    callId?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    buyAmountSol?: boolean
    maxPrice?: boolean
    slippageBps?: boolean
    status?: boolean
    errorMessage?: boolean
    tradeId?: boolean
    createdAt?: boolean
    processedAt?: boolean
  }

  export type AutoBuyQueueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userWalletAddress" | "callId" | "tokenAddress" | "tokenSymbol" | "buyAmountSol" | "maxPrice" | "slippageBps" | "status" | "errorMessage" | "tradeId" | "createdAt" | "processedAt", ExtArgs["result"]["autoBuyQueue"]>
  export type AutoBuyQueueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    call?: boolean | AutoBuyQueue$callArgs<ExtArgs>
    trade?: boolean | AutoBuyQueue$tradeArgs<ExtArgs>
  }
  export type AutoBuyQueueIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    call?: boolean | AutoBuyQueue$callArgs<ExtArgs>
    trade?: boolean | AutoBuyQueue$tradeArgs<ExtArgs>
  }
  export type AutoBuyQueueIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    call?: boolean | AutoBuyQueue$callArgs<ExtArgs>
    trade?: boolean | AutoBuyQueue$tradeArgs<ExtArgs>
  }

  export type $AutoBuyQueuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AutoBuyQueue"
    objects: {
      call: Prisma.$CallPayload<ExtArgs> | null
      trade: Prisma.$TradeHistoryPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userWalletAddress: string
      callId: string | null
      tokenAddress: string | null
      tokenSymbol: string
      buyAmountSol: Prisma.Decimal
      maxPrice: Prisma.Decimal | null
      slippageBps: number | null
      status: string
      errorMessage: string | null
      tradeId: string | null
      createdAt: Date
      processedAt: Date | null
    }, ExtArgs["result"]["autoBuyQueue"]>
    composites: {}
  }

  type AutoBuyQueueGetPayload<S extends boolean | null | undefined | AutoBuyQueueDefaultArgs> = $Result.GetResult<Prisma.$AutoBuyQueuePayload, S>

  type AutoBuyQueueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AutoBuyQueueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AutoBuyQueueCountAggregateInputType | true
    }

  export interface AutoBuyQueueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AutoBuyQueue'], meta: { name: 'AutoBuyQueue' } }
    /**
     * Find zero or one AutoBuyQueue that matches the filter.
     * @param {AutoBuyQueueFindUniqueArgs} args - Arguments to find a AutoBuyQueue
     * @example
     * // Get one AutoBuyQueue
     * const autoBuyQueue = await prisma.autoBuyQueue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AutoBuyQueueFindUniqueArgs>(args: SelectSubset<T, AutoBuyQueueFindUniqueArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AutoBuyQueue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AutoBuyQueueFindUniqueOrThrowArgs} args - Arguments to find a AutoBuyQueue
     * @example
     * // Get one AutoBuyQueue
     * const autoBuyQueue = await prisma.autoBuyQueue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AutoBuyQueueFindUniqueOrThrowArgs>(args: SelectSubset<T, AutoBuyQueueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AutoBuyQueue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueFindFirstArgs} args - Arguments to find a AutoBuyQueue
     * @example
     * // Get one AutoBuyQueue
     * const autoBuyQueue = await prisma.autoBuyQueue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AutoBuyQueueFindFirstArgs>(args?: SelectSubset<T, AutoBuyQueueFindFirstArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AutoBuyQueue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueFindFirstOrThrowArgs} args - Arguments to find a AutoBuyQueue
     * @example
     * // Get one AutoBuyQueue
     * const autoBuyQueue = await prisma.autoBuyQueue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AutoBuyQueueFindFirstOrThrowArgs>(args?: SelectSubset<T, AutoBuyQueueFindFirstOrThrowArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AutoBuyQueues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AutoBuyQueues
     * const autoBuyQueues = await prisma.autoBuyQueue.findMany()
     * 
     * // Get first 10 AutoBuyQueues
     * const autoBuyQueues = await prisma.autoBuyQueue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const autoBuyQueueWithIdOnly = await prisma.autoBuyQueue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AutoBuyQueueFindManyArgs>(args?: SelectSubset<T, AutoBuyQueueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AutoBuyQueue.
     * @param {AutoBuyQueueCreateArgs} args - Arguments to create a AutoBuyQueue.
     * @example
     * // Create one AutoBuyQueue
     * const AutoBuyQueue = await prisma.autoBuyQueue.create({
     *   data: {
     *     // ... data to create a AutoBuyQueue
     *   }
     * })
     * 
     */
    create<T extends AutoBuyQueueCreateArgs>(args: SelectSubset<T, AutoBuyQueueCreateArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AutoBuyQueues.
     * @param {AutoBuyQueueCreateManyArgs} args - Arguments to create many AutoBuyQueues.
     * @example
     * // Create many AutoBuyQueues
     * const autoBuyQueue = await prisma.autoBuyQueue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AutoBuyQueueCreateManyArgs>(args?: SelectSubset<T, AutoBuyQueueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AutoBuyQueues and returns the data saved in the database.
     * @param {AutoBuyQueueCreateManyAndReturnArgs} args - Arguments to create many AutoBuyQueues.
     * @example
     * // Create many AutoBuyQueues
     * const autoBuyQueue = await prisma.autoBuyQueue.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AutoBuyQueues and only return the `id`
     * const autoBuyQueueWithIdOnly = await prisma.autoBuyQueue.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AutoBuyQueueCreateManyAndReturnArgs>(args?: SelectSubset<T, AutoBuyQueueCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AutoBuyQueue.
     * @param {AutoBuyQueueDeleteArgs} args - Arguments to delete one AutoBuyQueue.
     * @example
     * // Delete one AutoBuyQueue
     * const AutoBuyQueue = await prisma.autoBuyQueue.delete({
     *   where: {
     *     // ... filter to delete one AutoBuyQueue
     *   }
     * })
     * 
     */
    delete<T extends AutoBuyQueueDeleteArgs>(args: SelectSubset<T, AutoBuyQueueDeleteArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AutoBuyQueue.
     * @param {AutoBuyQueueUpdateArgs} args - Arguments to update one AutoBuyQueue.
     * @example
     * // Update one AutoBuyQueue
     * const autoBuyQueue = await prisma.autoBuyQueue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AutoBuyQueueUpdateArgs>(args: SelectSubset<T, AutoBuyQueueUpdateArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AutoBuyQueues.
     * @param {AutoBuyQueueDeleteManyArgs} args - Arguments to filter AutoBuyQueues to delete.
     * @example
     * // Delete a few AutoBuyQueues
     * const { count } = await prisma.autoBuyQueue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AutoBuyQueueDeleteManyArgs>(args?: SelectSubset<T, AutoBuyQueueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutoBuyQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AutoBuyQueues
     * const autoBuyQueue = await prisma.autoBuyQueue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AutoBuyQueueUpdateManyArgs>(args: SelectSubset<T, AutoBuyQueueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AutoBuyQueues and returns the data updated in the database.
     * @param {AutoBuyQueueUpdateManyAndReturnArgs} args - Arguments to update many AutoBuyQueues.
     * @example
     * // Update many AutoBuyQueues
     * const autoBuyQueue = await prisma.autoBuyQueue.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AutoBuyQueues and only return the `id`
     * const autoBuyQueueWithIdOnly = await prisma.autoBuyQueue.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AutoBuyQueueUpdateManyAndReturnArgs>(args: SelectSubset<T, AutoBuyQueueUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AutoBuyQueue.
     * @param {AutoBuyQueueUpsertArgs} args - Arguments to update or create a AutoBuyQueue.
     * @example
     * // Update or create a AutoBuyQueue
     * const autoBuyQueue = await prisma.autoBuyQueue.upsert({
     *   create: {
     *     // ... data to create a AutoBuyQueue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AutoBuyQueue we want to update
     *   }
     * })
     */
    upsert<T extends AutoBuyQueueUpsertArgs>(args: SelectSubset<T, AutoBuyQueueUpsertArgs<ExtArgs>>): Prisma__AutoBuyQueueClient<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AutoBuyQueues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueCountArgs} args - Arguments to filter AutoBuyQueues to count.
     * @example
     * // Count the number of AutoBuyQueues
     * const count = await prisma.autoBuyQueue.count({
     *   where: {
     *     // ... the filter for the AutoBuyQueues we want to count
     *   }
     * })
    **/
    count<T extends AutoBuyQueueCountArgs>(
      args?: Subset<T, AutoBuyQueueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AutoBuyQueueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AutoBuyQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AutoBuyQueueAggregateArgs>(args: Subset<T, AutoBuyQueueAggregateArgs>): Prisma.PrismaPromise<GetAutoBuyQueueAggregateType<T>>

    /**
     * Group by AutoBuyQueue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AutoBuyQueueGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AutoBuyQueueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AutoBuyQueueGroupByArgs['orderBy'] }
        : { orderBy?: AutoBuyQueueGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AutoBuyQueueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAutoBuyQueueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AutoBuyQueue model
   */
  readonly fields: AutoBuyQueueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AutoBuyQueue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AutoBuyQueueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    call<T extends AutoBuyQueue$callArgs<ExtArgs> = {}>(args?: Subset<T, AutoBuyQueue$callArgs<ExtArgs>>): Prisma__CallClient<$Result.GetResult<Prisma.$CallPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    trade<T extends AutoBuyQueue$tradeArgs<ExtArgs> = {}>(args?: Subset<T, AutoBuyQueue$tradeArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AutoBuyQueue model
   */
  interface AutoBuyQueueFieldRefs {
    readonly id: FieldRef<"AutoBuyQueue", 'String'>
    readonly userWalletAddress: FieldRef<"AutoBuyQueue", 'String'>
    readonly callId: FieldRef<"AutoBuyQueue", 'String'>
    readonly tokenAddress: FieldRef<"AutoBuyQueue", 'String'>
    readonly tokenSymbol: FieldRef<"AutoBuyQueue", 'String'>
    readonly buyAmountSol: FieldRef<"AutoBuyQueue", 'Decimal'>
    readonly maxPrice: FieldRef<"AutoBuyQueue", 'Decimal'>
    readonly slippageBps: FieldRef<"AutoBuyQueue", 'Int'>
    readonly status: FieldRef<"AutoBuyQueue", 'String'>
    readonly errorMessage: FieldRef<"AutoBuyQueue", 'String'>
    readonly tradeId: FieldRef<"AutoBuyQueue", 'String'>
    readonly createdAt: FieldRef<"AutoBuyQueue", 'DateTime'>
    readonly processedAt: FieldRef<"AutoBuyQueue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AutoBuyQueue findUnique
   */
  export type AutoBuyQueueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * Filter, which AutoBuyQueue to fetch.
     */
    where: AutoBuyQueueWhereUniqueInput
  }

  /**
   * AutoBuyQueue findUniqueOrThrow
   */
  export type AutoBuyQueueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * Filter, which AutoBuyQueue to fetch.
     */
    where: AutoBuyQueueWhereUniqueInput
  }

  /**
   * AutoBuyQueue findFirst
   */
  export type AutoBuyQueueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * Filter, which AutoBuyQueue to fetch.
     */
    where?: AutoBuyQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutoBuyQueues to fetch.
     */
    orderBy?: AutoBuyQueueOrderByWithRelationInput | AutoBuyQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutoBuyQueues.
     */
    cursor?: AutoBuyQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutoBuyQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutoBuyQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutoBuyQueues.
     */
    distinct?: AutoBuyQueueScalarFieldEnum | AutoBuyQueueScalarFieldEnum[]
  }

  /**
   * AutoBuyQueue findFirstOrThrow
   */
  export type AutoBuyQueueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * Filter, which AutoBuyQueue to fetch.
     */
    where?: AutoBuyQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutoBuyQueues to fetch.
     */
    orderBy?: AutoBuyQueueOrderByWithRelationInput | AutoBuyQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AutoBuyQueues.
     */
    cursor?: AutoBuyQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutoBuyQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutoBuyQueues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AutoBuyQueues.
     */
    distinct?: AutoBuyQueueScalarFieldEnum | AutoBuyQueueScalarFieldEnum[]
  }

  /**
   * AutoBuyQueue findMany
   */
  export type AutoBuyQueueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * Filter, which AutoBuyQueues to fetch.
     */
    where?: AutoBuyQueueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AutoBuyQueues to fetch.
     */
    orderBy?: AutoBuyQueueOrderByWithRelationInput | AutoBuyQueueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AutoBuyQueues.
     */
    cursor?: AutoBuyQueueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AutoBuyQueues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AutoBuyQueues.
     */
    skip?: number
    distinct?: AutoBuyQueueScalarFieldEnum | AutoBuyQueueScalarFieldEnum[]
  }

  /**
   * AutoBuyQueue create
   */
  export type AutoBuyQueueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * The data needed to create a AutoBuyQueue.
     */
    data: XOR<AutoBuyQueueCreateInput, AutoBuyQueueUncheckedCreateInput>
  }

  /**
   * AutoBuyQueue createMany
   */
  export type AutoBuyQueueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AutoBuyQueues.
     */
    data: AutoBuyQueueCreateManyInput | AutoBuyQueueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AutoBuyQueue createManyAndReturn
   */
  export type AutoBuyQueueCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * The data used to create many AutoBuyQueues.
     */
    data: AutoBuyQueueCreateManyInput | AutoBuyQueueCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * AutoBuyQueue update
   */
  export type AutoBuyQueueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * The data needed to update a AutoBuyQueue.
     */
    data: XOR<AutoBuyQueueUpdateInput, AutoBuyQueueUncheckedUpdateInput>
    /**
     * Choose, which AutoBuyQueue to update.
     */
    where: AutoBuyQueueWhereUniqueInput
  }

  /**
   * AutoBuyQueue updateMany
   */
  export type AutoBuyQueueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AutoBuyQueues.
     */
    data: XOR<AutoBuyQueueUpdateManyMutationInput, AutoBuyQueueUncheckedUpdateManyInput>
    /**
     * Filter which AutoBuyQueues to update
     */
    where?: AutoBuyQueueWhereInput
    /**
     * Limit how many AutoBuyQueues to update.
     */
    limit?: number
  }

  /**
   * AutoBuyQueue updateManyAndReturn
   */
  export type AutoBuyQueueUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * The data used to update AutoBuyQueues.
     */
    data: XOR<AutoBuyQueueUpdateManyMutationInput, AutoBuyQueueUncheckedUpdateManyInput>
    /**
     * Filter which AutoBuyQueues to update
     */
    where?: AutoBuyQueueWhereInput
    /**
     * Limit how many AutoBuyQueues to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * AutoBuyQueue upsert
   */
  export type AutoBuyQueueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * The filter to search for the AutoBuyQueue to update in case it exists.
     */
    where: AutoBuyQueueWhereUniqueInput
    /**
     * In case the AutoBuyQueue found by the `where` argument doesn't exist, create a new AutoBuyQueue with this data.
     */
    create: XOR<AutoBuyQueueCreateInput, AutoBuyQueueUncheckedCreateInput>
    /**
     * In case the AutoBuyQueue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AutoBuyQueueUpdateInput, AutoBuyQueueUncheckedUpdateInput>
  }

  /**
   * AutoBuyQueue delete
   */
  export type AutoBuyQueueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    /**
     * Filter which AutoBuyQueue to delete.
     */
    where: AutoBuyQueueWhereUniqueInput
  }

  /**
   * AutoBuyQueue deleteMany
   */
  export type AutoBuyQueueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AutoBuyQueues to delete
     */
    where?: AutoBuyQueueWhereInput
    /**
     * Limit how many AutoBuyQueues to delete.
     */
    limit?: number
  }

  /**
   * AutoBuyQueue.call
   */
  export type AutoBuyQueue$callArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Call
     */
    select?: CallSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Call
     */
    omit?: CallOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CallInclude<ExtArgs> | null
    where?: CallWhereInput
  }

  /**
   * AutoBuyQueue.trade
   */
  export type AutoBuyQueue$tradeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    where?: TradeHistoryWhereInput
  }

  /**
   * AutoBuyQueue without action
   */
  export type AutoBuyQueueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
  }


  /**
   * Model TradeHistory
   */

  export type AggregateTradeHistory = {
    _count: TradeHistoryCountAggregateOutputType | null
    _avg: TradeHistoryAvgAggregateOutputType | null
    _sum: TradeHistorySumAggregateOutputType | null
    _min: TradeHistoryMinAggregateOutputType | null
    _max: TradeHistoryMaxAggregateOutputType | null
  }

  export type TradeHistoryAvgAggregateOutputType = {
    amountSol: Decimal | null
    amountTokens: Decimal | null
    price: Decimal | null
    slippageBps: number | null
    priceImpactPct: Decimal | null
  }

  export type TradeHistorySumAggregateOutputType = {
    amountSol: Decimal | null
    amountTokens: Decimal | null
    price: Decimal | null
    slippageBps: number | null
    priceImpactPct: Decimal | null
  }

  export type TradeHistoryMinAggregateOutputType = {
    id: string | null
    positionId: string | null
    userWalletAddress: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    tradeType: string | null
    amountSol: Decimal | null
    amountTokens: Decimal | null
    price: Decimal | null
    slippageBps: number | null
    priceImpactPct: Decimal | null
    txSignature: string | null
    txStatus: string | null
    errorMessage: string | null
    createdAt: Date | null
    confirmedAt: Date | null
  }

  export type TradeHistoryMaxAggregateOutputType = {
    id: string | null
    positionId: string | null
    userWalletAddress: string | null
    tokenAddress: string | null
    tokenSymbol: string | null
    tradeType: string | null
    amountSol: Decimal | null
    amountTokens: Decimal | null
    price: Decimal | null
    slippageBps: number | null
    priceImpactPct: Decimal | null
    txSignature: string | null
    txStatus: string | null
    errorMessage: string | null
    createdAt: Date | null
    confirmedAt: Date | null
  }

  export type TradeHistoryCountAggregateOutputType = {
    id: number
    positionId: number
    userWalletAddress: number
    tokenAddress: number
    tokenSymbol: number
    tradeType: number
    amountSol: number
    amountTokens: number
    price: number
    slippageBps: number
    priceImpactPct: number
    txSignature: number
    txStatus: number
    errorMessage: number
    jupiterQuote: number
    createdAt: number
    confirmedAt: number
    _all: number
  }


  export type TradeHistoryAvgAggregateInputType = {
    amountSol?: true
    amountTokens?: true
    price?: true
    slippageBps?: true
    priceImpactPct?: true
  }

  export type TradeHistorySumAggregateInputType = {
    amountSol?: true
    amountTokens?: true
    price?: true
    slippageBps?: true
    priceImpactPct?: true
  }

  export type TradeHistoryMinAggregateInputType = {
    id?: true
    positionId?: true
    userWalletAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    tradeType?: true
    amountSol?: true
    amountTokens?: true
    price?: true
    slippageBps?: true
    priceImpactPct?: true
    txSignature?: true
    txStatus?: true
    errorMessage?: true
    createdAt?: true
    confirmedAt?: true
  }

  export type TradeHistoryMaxAggregateInputType = {
    id?: true
    positionId?: true
    userWalletAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    tradeType?: true
    amountSol?: true
    amountTokens?: true
    price?: true
    slippageBps?: true
    priceImpactPct?: true
    txSignature?: true
    txStatus?: true
    errorMessage?: true
    createdAt?: true
    confirmedAt?: true
  }

  export type TradeHistoryCountAggregateInputType = {
    id?: true
    positionId?: true
    userWalletAddress?: true
    tokenAddress?: true
    tokenSymbol?: true
    tradeType?: true
    amountSol?: true
    amountTokens?: true
    price?: true
    slippageBps?: true
    priceImpactPct?: true
    txSignature?: true
    txStatus?: true
    errorMessage?: true
    jupiterQuote?: true
    createdAt?: true
    confirmedAt?: true
    _all?: true
  }

  export type TradeHistoryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeHistory to aggregate.
     */
    where?: TradeHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeHistories to fetch.
     */
    orderBy?: TradeHistoryOrderByWithRelationInput | TradeHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TradeHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TradeHistories
    **/
    _count?: true | TradeHistoryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TradeHistoryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TradeHistorySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TradeHistoryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TradeHistoryMaxAggregateInputType
  }

  export type GetTradeHistoryAggregateType<T extends TradeHistoryAggregateArgs> = {
        [P in keyof T & keyof AggregateTradeHistory]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTradeHistory[P]>
      : GetScalarType<T[P], AggregateTradeHistory[P]>
  }




  export type TradeHistoryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TradeHistoryWhereInput
    orderBy?: TradeHistoryOrderByWithAggregationInput | TradeHistoryOrderByWithAggregationInput[]
    by: TradeHistoryScalarFieldEnum[] | TradeHistoryScalarFieldEnum
    having?: TradeHistoryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TradeHistoryCountAggregateInputType | true
    _avg?: TradeHistoryAvgAggregateInputType
    _sum?: TradeHistorySumAggregateInputType
    _min?: TradeHistoryMinAggregateInputType
    _max?: TradeHistoryMaxAggregateInputType
  }

  export type TradeHistoryGroupByOutputType = {
    id: string
    positionId: string | null
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol: string | null
    tradeType: string
    amountSol: Decimal
    amountTokens: Decimal
    price: Decimal
    slippageBps: number | null
    priceImpactPct: Decimal | null
    txSignature: string | null
    txStatus: string
    errorMessage: string | null
    jupiterQuote: JsonValue | null
    createdAt: Date
    confirmedAt: Date | null
    _count: TradeHistoryCountAggregateOutputType | null
    _avg: TradeHistoryAvgAggregateOutputType | null
    _sum: TradeHistorySumAggregateOutputType | null
    _min: TradeHistoryMinAggregateOutputType | null
    _max: TradeHistoryMaxAggregateOutputType | null
  }

  type GetTradeHistoryGroupByPayload<T extends TradeHistoryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TradeHistoryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TradeHistoryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TradeHistoryGroupByOutputType[P]>
            : GetScalarType<T[P], TradeHistoryGroupByOutputType[P]>
        }
      >
    >


  export type TradeHistorySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    tradeType?: boolean
    amountSol?: boolean
    amountTokens?: boolean
    price?: boolean
    slippageBps?: boolean
    priceImpactPct?: boolean
    txSignature?: boolean
    txStatus?: boolean
    errorMessage?: boolean
    jupiterQuote?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
    position?: boolean | TradeHistory$positionArgs<ExtArgs>
    autoBuyQueue?: boolean | TradeHistory$autoBuyQueueArgs<ExtArgs>
    _count?: boolean | TradeHistoryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tradeHistory"]>

  export type TradeHistorySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    tradeType?: boolean
    amountSol?: boolean
    amountTokens?: boolean
    price?: boolean
    slippageBps?: boolean
    priceImpactPct?: boolean
    txSignature?: boolean
    txStatus?: boolean
    errorMessage?: boolean
    jupiterQuote?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
    position?: boolean | TradeHistory$positionArgs<ExtArgs>
  }, ExtArgs["result"]["tradeHistory"]>

  export type TradeHistorySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    tradeType?: boolean
    amountSol?: boolean
    amountTokens?: boolean
    price?: boolean
    slippageBps?: boolean
    priceImpactPct?: boolean
    txSignature?: boolean
    txStatus?: boolean
    errorMessage?: boolean
    jupiterQuote?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
    position?: boolean | TradeHistory$positionArgs<ExtArgs>
  }, ExtArgs["result"]["tradeHistory"]>

  export type TradeHistorySelectScalar = {
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    tokenSymbol?: boolean
    tradeType?: boolean
    amountSol?: boolean
    amountTokens?: boolean
    price?: boolean
    slippageBps?: boolean
    priceImpactPct?: boolean
    txSignature?: boolean
    txStatus?: boolean
    errorMessage?: boolean
    jupiterQuote?: boolean
    createdAt?: boolean
    confirmedAt?: boolean
  }

  export type TradeHistoryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "positionId" | "userWalletAddress" | "tokenAddress" | "tokenSymbol" | "tradeType" | "amountSol" | "amountTokens" | "price" | "slippageBps" | "priceImpactPct" | "txSignature" | "txStatus" | "errorMessage" | "jupiterQuote" | "createdAt" | "confirmedAt", ExtArgs["result"]["tradeHistory"]>
  export type TradeHistoryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | TradeHistory$positionArgs<ExtArgs>
    autoBuyQueue?: boolean | TradeHistory$autoBuyQueueArgs<ExtArgs>
    _count?: boolean | TradeHistoryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TradeHistoryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | TradeHistory$positionArgs<ExtArgs>
  }
  export type TradeHistoryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | TradeHistory$positionArgs<ExtArgs>
  }

  export type $TradeHistoryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TradeHistory"
    objects: {
      position: Prisma.$TradingPositionPayload<ExtArgs> | null
      autoBuyQueue: Prisma.$AutoBuyQueuePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      positionId: string | null
      userWalletAddress: string
      tokenAddress: string
      tokenSymbol: string | null
      tradeType: string
      amountSol: Prisma.Decimal
      amountTokens: Prisma.Decimal
      price: Prisma.Decimal
      slippageBps: number | null
      priceImpactPct: Prisma.Decimal | null
      txSignature: string | null
      txStatus: string
      errorMessage: string | null
      jupiterQuote: Prisma.JsonValue | null
      createdAt: Date
      confirmedAt: Date | null
    }, ExtArgs["result"]["tradeHistory"]>
    composites: {}
  }

  type TradeHistoryGetPayload<S extends boolean | null | undefined | TradeHistoryDefaultArgs> = $Result.GetResult<Prisma.$TradeHistoryPayload, S>

  type TradeHistoryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TradeHistoryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TradeHistoryCountAggregateInputType | true
    }

  export interface TradeHistoryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TradeHistory'], meta: { name: 'TradeHistory' } }
    /**
     * Find zero or one TradeHistory that matches the filter.
     * @param {TradeHistoryFindUniqueArgs} args - Arguments to find a TradeHistory
     * @example
     * // Get one TradeHistory
     * const tradeHistory = await prisma.tradeHistory.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TradeHistoryFindUniqueArgs>(args: SelectSubset<T, TradeHistoryFindUniqueArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TradeHistory that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TradeHistoryFindUniqueOrThrowArgs} args - Arguments to find a TradeHistory
     * @example
     * // Get one TradeHistory
     * const tradeHistory = await prisma.tradeHistory.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TradeHistoryFindUniqueOrThrowArgs>(args: SelectSubset<T, TradeHistoryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeHistory that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryFindFirstArgs} args - Arguments to find a TradeHistory
     * @example
     * // Get one TradeHistory
     * const tradeHistory = await prisma.tradeHistory.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TradeHistoryFindFirstArgs>(args?: SelectSubset<T, TradeHistoryFindFirstArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TradeHistory that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryFindFirstOrThrowArgs} args - Arguments to find a TradeHistory
     * @example
     * // Get one TradeHistory
     * const tradeHistory = await prisma.tradeHistory.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TradeHistoryFindFirstOrThrowArgs>(args?: SelectSubset<T, TradeHistoryFindFirstOrThrowArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TradeHistories that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TradeHistories
     * const tradeHistories = await prisma.tradeHistory.findMany()
     * 
     * // Get first 10 TradeHistories
     * const tradeHistories = await prisma.tradeHistory.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tradeHistoryWithIdOnly = await prisma.tradeHistory.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TradeHistoryFindManyArgs>(args?: SelectSubset<T, TradeHistoryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TradeHistory.
     * @param {TradeHistoryCreateArgs} args - Arguments to create a TradeHistory.
     * @example
     * // Create one TradeHistory
     * const TradeHistory = await prisma.tradeHistory.create({
     *   data: {
     *     // ... data to create a TradeHistory
     *   }
     * })
     * 
     */
    create<T extends TradeHistoryCreateArgs>(args: SelectSubset<T, TradeHistoryCreateArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TradeHistories.
     * @param {TradeHistoryCreateManyArgs} args - Arguments to create many TradeHistories.
     * @example
     * // Create many TradeHistories
     * const tradeHistory = await prisma.tradeHistory.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TradeHistoryCreateManyArgs>(args?: SelectSubset<T, TradeHistoryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TradeHistories and returns the data saved in the database.
     * @param {TradeHistoryCreateManyAndReturnArgs} args - Arguments to create many TradeHistories.
     * @example
     * // Create many TradeHistories
     * const tradeHistory = await prisma.tradeHistory.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TradeHistories and only return the `id`
     * const tradeHistoryWithIdOnly = await prisma.tradeHistory.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TradeHistoryCreateManyAndReturnArgs>(args?: SelectSubset<T, TradeHistoryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TradeHistory.
     * @param {TradeHistoryDeleteArgs} args - Arguments to delete one TradeHistory.
     * @example
     * // Delete one TradeHistory
     * const TradeHistory = await prisma.tradeHistory.delete({
     *   where: {
     *     // ... filter to delete one TradeHistory
     *   }
     * })
     * 
     */
    delete<T extends TradeHistoryDeleteArgs>(args: SelectSubset<T, TradeHistoryDeleteArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TradeHistory.
     * @param {TradeHistoryUpdateArgs} args - Arguments to update one TradeHistory.
     * @example
     * // Update one TradeHistory
     * const tradeHistory = await prisma.tradeHistory.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TradeHistoryUpdateArgs>(args: SelectSubset<T, TradeHistoryUpdateArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TradeHistories.
     * @param {TradeHistoryDeleteManyArgs} args - Arguments to filter TradeHistories to delete.
     * @example
     * // Delete a few TradeHistories
     * const { count } = await prisma.tradeHistory.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TradeHistoryDeleteManyArgs>(args?: SelectSubset<T, TradeHistoryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TradeHistories
     * const tradeHistory = await prisma.tradeHistory.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TradeHistoryUpdateManyArgs>(args: SelectSubset<T, TradeHistoryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TradeHistories and returns the data updated in the database.
     * @param {TradeHistoryUpdateManyAndReturnArgs} args - Arguments to update many TradeHistories.
     * @example
     * // Update many TradeHistories
     * const tradeHistory = await prisma.tradeHistory.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TradeHistories and only return the `id`
     * const tradeHistoryWithIdOnly = await prisma.tradeHistory.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TradeHistoryUpdateManyAndReturnArgs>(args: SelectSubset<T, TradeHistoryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TradeHistory.
     * @param {TradeHistoryUpsertArgs} args - Arguments to update or create a TradeHistory.
     * @example
     * // Update or create a TradeHistory
     * const tradeHistory = await prisma.tradeHistory.upsert({
     *   create: {
     *     // ... data to create a TradeHistory
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TradeHistory we want to update
     *   }
     * })
     */
    upsert<T extends TradeHistoryUpsertArgs>(args: SelectSubset<T, TradeHistoryUpsertArgs<ExtArgs>>): Prisma__TradeHistoryClient<$Result.GetResult<Prisma.$TradeHistoryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TradeHistories.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryCountArgs} args - Arguments to filter TradeHistories to count.
     * @example
     * // Count the number of TradeHistories
     * const count = await prisma.tradeHistory.count({
     *   where: {
     *     // ... the filter for the TradeHistories we want to count
     *   }
     * })
    **/
    count<T extends TradeHistoryCountArgs>(
      args?: Subset<T, TradeHistoryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TradeHistoryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TradeHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TradeHistoryAggregateArgs>(args: Subset<T, TradeHistoryAggregateArgs>): Prisma.PrismaPromise<GetTradeHistoryAggregateType<T>>

    /**
     * Group by TradeHistory.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TradeHistoryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TradeHistoryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TradeHistoryGroupByArgs['orderBy'] }
        : { orderBy?: TradeHistoryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TradeHistoryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTradeHistoryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TradeHistory model
   */
  readonly fields: TradeHistoryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TradeHistory.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TradeHistoryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    position<T extends TradeHistory$positionArgs<ExtArgs> = {}>(args?: Subset<T, TradeHistory$positionArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    autoBuyQueue<T extends TradeHistory$autoBuyQueueArgs<ExtArgs> = {}>(args?: Subset<T, TradeHistory$autoBuyQueueArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AutoBuyQueuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TradeHistory model
   */
  interface TradeHistoryFieldRefs {
    readonly id: FieldRef<"TradeHistory", 'String'>
    readonly positionId: FieldRef<"TradeHistory", 'String'>
    readonly userWalletAddress: FieldRef<"TradeHistory", 'String'>
    readonly tokenAddress: FieldRef<"TradeHistory", 'String'>
    readonly tokenSymbol: FieldRef<"TradeHistory", 'String'>
    readonly tradeType: FieldRef<"TradeHistory", 'String'>
    readonly amountSol: FieldRef<"TradeHistory", 'Decimal'>
    readonly amountTokens: FieldRef<"TradeHistory", 'Decimal'>
    readonly price: FieldRef<"TradeHistory", 'Decimal'>
    readonly slippageBps: FieldRef<"TradeHistory", 'Int'>
    readonly priceImpactPct: FieldRef<"TradeHistory", 'Decimal'>
    readonly txSignature: FieldRef<"TradeHistory", 'String'>
    readonly txStatus: FieldRef<"TradeHistory", 'String'>
    readonly errorMessage: FieldRef<"TradeHistory", 'String'>
    readonly jupiterQuote: FieldRef<"TradeHistory", 'Json'>
    readonly createdAt: FieldRef<"TradeHistory", 'DateTime'>
    readonly confirmedAt: FieldRef<"TradeHistory", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TradeHistory findUnique
   */
  export type TradeHistoryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TradeHistory to fetch.
     */
    where: TradeHistoryWhereUniqueInput
  }

  /**
   * TradeHistory findUniqueOrThrow
   */
  export type TradeHistoryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TradeHistory to fetch.
     */
    where: TradeHistoryWhereUniqueInput
  }

  /**
   * TradeHistory findFirst
   */
  export type TradeHistoryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TradeHistory to fetch.
     */
    where?: TradeHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeHistories to fetch.
     */
    orderBy?: TradeHistoryOrderByWithRelationInput | TradeHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeHistories.
     */
    cursor?: TradeHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeHistories.
     */
    distinct?: TradeHistoryScalarFieldEnum | TradeHistoryScalarFieldEnum[]
  }

  /**
   * TradeHistory findFirstOrThrow
   */
  export type TradeHistoryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TradeHistory to fetch.
     */
    where?: TradeHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeHistories to fetch.
     */
    orderBy?: TradeHistoryOrderByWithRelationInput | TradeHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TradeHistories.
     */
    cursor?: TradeHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeHistories.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TradeHistories.
     */
    distinct?: TradeHistoryScalarFieldEnum | TradeHistoryScalarFieldEnum[]
  }

  /**
   * TradeHistory findMany
   */
  export type TradeHistoryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * Filter, which TradeHistories to fetch.
     */
    where?: TradeHistoryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TradeHistories to fetch.
     */
    orderBy?: TradeHistoryOrderByWithRelationInput | TradeHistoryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TradeHistories.
     */
    cursor?: TradeHistoryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TradeHistories from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TradeHistories.
     */
    skip?: number
    distinct?: TradeHistoryScalarFieldEnum | TradeHistoryScalarFieldEnum[]
  }

  /**
   * TradeHistory create
   */
  export type TradeHistoryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * The data needed to create a TradeHistory.
     */
    data: XOR<TradeHistoryCreateInput, TradeHistoryUncheckedCreateInput>
  }

  /**
   * TradeHistory createMany
   */
  export type TradeHistoryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TradeHistories.
     */
    data: TradeHistoryCreateManyInput | TradeHistoryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TradeHistory createManyAndReturn
   */
  export type TradeHistoryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * The data used to create many TradeHistories.
     */
    data: TradeHistoryCreateManyInput | TradeHistoryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeHistory update
   */
  export type TradeHistoryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * The data needed to update a TradeHistory.
     */
    data: XOR<TradeHistoryUpdateInput, TradeHistoryUncheckedUpdateInput>
    /**
     * Choose, which TradeHistory to update.
     */
    where: TradeHistoryWhereUniqueInput
  }

  /**
   * TradeHistory updateMany
   */
  export type TradeHistoryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TradeHistories.
     */
    data: XOR<TradeHistoryUpdateManyMutationInput, TradeHistoryUncheckedUpdateManyInput>
    /**
     * Filter which TradeHistories to update
     */
    where?: TradeHistoryWhereInput
    /**
     * Limit how many TradeHistories to update.
     */
    limit?: number
  }

  /**
   * TradeHistory updateManyAndReturn
   */
  export type TradeHistoryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * The data used to update TradeHistories.
     */
    data: XOR<TradeHistoryUpdateManyMutationInput, TradeHistoryUncheckedUpdateManyInput>
    /**
     * Filter which TradeHistories to update
     */
    where?: TradeHistoryWhereInput
    /**
     * Limit how many TradeHistories to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TradeHistory upsert
   */
  export type TradeHistoryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * The filter to search for the TradeHistory to update in case it exists.
     */
    where: TradeHistoryWhereUniqueInput
    /**
     * In case the TradeHistory found by the `where` argument doesn't exist, create a new TradeHistory with this data.
     */
    create: XOR<TradeHistoryCreateInput, TradeHistoryUncheckedCreateInput>
    /**
     * In case the TradeHistory was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TradeHistoryUpdateInput, TradeHistoryUncheckedUpdateInput>
  }

  /**
   * TradeHistory delete
   */
  export type TradeHistoryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
    /**
     * Filter which TradeHistory to delete.
     */
    where: TradeHistoryWhereUniqueInput
  }

  /**
   * TradeHistory deleteMany
   */
  export type TradeHistoryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TradeHistories to delete
     */
    where?: TradeHistoryWhereInput
    /**
     * Limit how many TradeHistories to delete.
     */
    limit?: number
  }

  /**
   * TradeHistory.position
   */
  export type TradeHistory$positionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    where?: TradingPositionWhereInput
  }

  /**
   * TradeHistory.autoBuyQueue
   */
  export type TradeHistory$autoBuyQueueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AutoBuyQueue
     */
    select?: AutoBuyQueueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AutoBuyQueue
     */
    omit?: AutoBuyQueueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AutoBuyQueueInclude<ExtArgs> | null
    where?: AutoBuyQueueWhereInput
    orderBy?: AutoBuyQueueOrderByWithRelationInput | AutoBuyQueueOrderByWithRelationInput[]
    cursor?: AutoBuyQueueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AutoBuyQueueScalarFieldEnum | AutoBuyQueueScalarFieldEnum[]
  }

  /**
   * TradeHistory without action
   */
  export type TradeHistoryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradeHistory
     */
    select?: TradeHistorySelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradeHistory
     */
    omit?: TradeHistoryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradeHistoryInclude<ExtArgs> | null
  }


  /**
   * Model PriceAlert
   */

  export type AggregatePriceAlert = {
    _count: PriceAlertCountAggregateOutputType | null
    _avg: PriceAlertAvgAggregateOutputType | null
    _sum: PriceAlertSumAggregateOutputType | null
    _min: PriceAlertMinAggregateOutputType | null
    _max: PriceAlertMaxAggregateOutputType | null
  }

  export type PriceAlertAvgAggregateOutputType = {
    targetPrice: Decimal | null
  }

  export type PriceAlertSumAggregateOutputType = {
    targetPrice: Decimal | null
  }

  export type PriceAlertMinAggregateOutputType = {
    id: string | null
    positionId: string | null
    userWalletAddress: string | null
    tokenAddress: string | null
    alertType: string | null
    targetPrice: Decimal | null
    isActive: boolean | null
    triggeredAt: Date | null
    createdAt: Date | null
  }

  export type PriceAlertMaxAggregateOutputType = {
    id: string | null
    positionId: string | null
    userWalletAddress: string | null
    tokenAddress: string | null
    alertType: string | null
    targetPrice: Decimal | null
    isActive: boolean | null
    triggeredAt: Date | null
    createdAt: Date | null
  }

  export type PriceAlertCountAggregateOutputType = {
    id: number
    positionId: number
    userWalletAddress: number
    tokenAddress: number
    alertType: number
    targetPrice: number
    isActive: number
    triggeredAt: number
    createdAt: number
    _all: number
  }


  export type PriceAlertAvgAggregateInputType = {
    targetPrice?: true
  }

  export type PriceAlertSumAggregateInputType = {
    targetPrice?: true
  }

  export type PriceAlertMinAggregateInputType = {
    id?: true
    positionId?: true
    userWalletAddress?: true
    tokenAddress?: true
    alertType?: true
    targetPrice?: true
    isActive?: true
    triggeredAt?: true
    createdAt?: true
  }

  export type PriceAlertMaxAggregateInputType = {
    id?: true
    positionId?: true
    userWalletAddress?: true
    tokenAddress?: true
    alertType?: true
    targetPrice?: true
    isActive?: true
    triggeredAt?: true
    createdAt?: true
  }

  export type PriceAlertCountAggregateInputType = {
    id?: true
    positionId?: true
    userWalletAddress?: true
    tokenAddress?: true
    alertType?: true
    targetPrice?: true
    isActive?: true
    triggeredAt?: true
    createdAt?: true
    _all?: true
  }

  export type PriceAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceAlert to aggregate.
     */
    where?: PriceAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceAlerts to fetch.
     */
    orderBy?: PriceAlertOrderByWithRelationInput | PriceAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PriceAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PriceAlerts
    **/
    _count?: true | PriceAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PriceAlertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PriceAlertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PriceAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PriceAlertMaxAggregateInputType
  }

  export type GetPriceAlertAggregateType<T extends PriceAlertAggregateArgs> = {
        [P in keyof T & keyof AggregatePriceAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePriceAlert[P]>
      : GetScalarType<T[P], AggregatePriceAlert[P]>
  }




  export type PriceAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PriceAlertWhereInput
    orderBy?: PriceAlertOrderByWithAggregationInput | PriceAlertOrderByWithAggregationInput[]
    by: PriceAlertScalarFieldEnum[] | PriceAlertScalarFieldEnum
    having?: PriceAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PriceAlertCountAggregateInputType | true
    _avg?: PriceAlertAvgAggregateInputType
    _sum?: PriceAlertSumAggregateInputType
    _min?: PriceAlertMinAggregateInputType
    _max?: PriceAlertMaxAggregateInputType
  }

  export type PriceAlertGroupByOutputType = {
    id: string
    positionId: string | null
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal
    isActive: boolean
    triggeredAt: Date | null
    createdAt: Date
    _count: PriceAlertCountAggregateOutputType | null
    _avg: PriceAlertAvgAggregateOutputType | null
    _sum: PriceAlertSumAggregateOutputType | null
    _min: PriceAlertMinAggregateOutputType | null
    _max: PriceAlertMaxAggregateOutputType | null
  }

  type GetPriceAlertGroupByPayload<T extends PriceAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PriceAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PriceAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PriceAlertGroupByOutputType[P]>
            : GetScalarType<T[P], PriceAlertGroupByOutputType[P]>
        }
      >
    >


  export type PriceAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    alertType?: boolean
    targetPrice?: boolean
    isActive?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    position?: boolean | PriceAlert$positionArgs<ExtArgs>
  }, ExtArgs["result"]["priceAlert"]>

  export type PriceAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    alertType?: boolean
    targetPrice?: boolean
    isActive?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    position?: boolean | PriceAlert$positionArgs<ExtArgs>
  }, ExtArgs["result"]["priceAlert"]>

  export type PriceAlertSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    alertType?: boolean
    targetPrice?: boolean
    isActive?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
    position?: boolean | PriceAlert$positionArgs<ExtArgs>
  }, ExtArgs["result"]["priceAlert"]>

  export type PriceAlertSelectScalar = {
    id?: boolean
    positionId?: boolean
    userWalletAddress?: boolean
    tokenAddress?: boolean
    alertType?: boolean
    targetPrice?: boolean
    isActive?: boolean
    triggeredAt?: boolean
    createdAt?: boolean
  }

  export type PriceAlertOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "positionId" | "userWalletAddress" | "tokenAddress" | "alertType" | "targetPrice" | "isActive" | "triggeredAt" | "createdAt", ExtArgs["result"]["priceAlert"]>
  export type PriceAlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | PriceAlert$positionArgs<ExtArgs>
  }
  export type PriceAlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | PriceAlert$positionArgs<ExtArgs>
  }
  export type PriceAlertIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    position?: boolean | PriceAlert$positionArgs<ExtArgs>
  }

  export type $PriceAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PriceAlert"
    objects: {
      position: Prisma.$TradingPositionPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      positionId: string | null
      userWalletAddress: string
      tokenAddress: string
      alertType: string
      targetPrice: Prisma.Decimal
      isActive: boolean
      triggeredAt: Date | null
      createdAt: Date
    }, ExtArgs["result"]["priceAlert"]>
    composites: {}
  }

  type PriceAlertGetPayload<S extends boolean | null | undefined | PriceAlertDefaultArgs> = $Result.GetResult<Prisma.$PriceAlertPayload, S>

  type PriceAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PriceAlertFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PriceAlertCountAggregateInputType | true
    }

  export interface PriceAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PriceAlert'], meta: { name: 'PriceAlert' } }
    /**
     * Find zero or one PriceAlert that matches the filter.
     * @param {PriceAlertFindUniqueArgs} args - Arguments to find a PriceAlert
     * @example
     * // Get one PriceAlert
     * const priceAlert = await prisma.priceAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PriceAlertFindUniqueArgs>(args: SelectSubset<T, PriceAlertFindUniqueArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PriceAlert that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PriceAlertFindUniqueOrThrowArgs} args - Arguments to find a PriceAlert
     * @example
     * // Get one PriceAlert
     * const priceAlert = await prisma.priceAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PriceAlertFindUniqueOrThrowArgs>(args: SelectSubset<T, PriceAlertFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertFindFirstArgs} args - Arguments to find a PriceAlert
     * @example
     * // Get one PriceAlert
     * const priceAlert = await prisma.priceAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PriceAlertFindFirstArgs>(args?: SelectSubset<T, PriceAlertFindFirstArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PriceAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertFindFirstOrThrowArgs} args - Arguments to find a PriceAlert
     * @example
     * // Get one PriceAlert
     * const priceAlert = await prisma.priceAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PriceAlertFindFirstOrThrowArgs>(args?: SelectSubset<T, PriceAlertFindFirstOrThrowArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PriceAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PriceAlerts
     * const priceAlerts = await prisma.priceAlert.findMany()
     * 
     * // Get first 10 PriceAlerts
     * const priceAlerts = await prisma.priceAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const priceAlertWithIdOnly = await prisma.priceAlert.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PriceAlertFindManyArgs>(args?: SelectSubset<T, PriceAlertFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PriceAlert.
     * @param {PriceAlertCreateArgs} args - Arguments to create a PriceAlert.
     * @example
     * // Create one PriceAlert
     * const PriceAlert = await prisma.priceAlert.create({
     *   data: {
     *     // ... data to create a PriceAlert
     *   }
     * })
     * 
     */
    create<T extends PriceAlertCreateArgs>(args: SelectSubset<T, PriceAlertCreateArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PriceAlerts.
     * @param {PriceAlertCreateManyArgs} args - Arguments to create many PriceAlerts.
     * @example
     * // Create many PriceAlerts
     * const priceAlert = await prisma.priceAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PriceAlertCreateManyArgs>(args?: SelectSubset<T, PriceAlertCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PriceAlerts and returns the data saved in the database.
     * @param {PriceAlertCreateManyAndReturnArgs} args - Arguments to create many PriceAlerts.
     * @example
     * // Create many PriceAlerts
     * const priceAlert = await prisma.priceAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PriceAlerts and only return the `id`
     * const priceAlertWithIdOnly = await prisma.priceAlert.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PriceAlertCreateManyAndReturnArgs>(args?: SelectSubset<T, PriceAlertCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PriceAlert.
     * @param {PriceAlertDeleteArgs} args - Arguments to delete one PriceAlert.
     * @example
     * // Delete one PriceAlert
     * const PriceAlert = await prisma.priceAlert.delete({
     *   where: {
     *     // ... filter to delete one PriceAlert
     *   }
     * })
     * 
     */
    delete<T extends PriceAlertDeleteArgs>(args: SelectSubset<T, PriceAlertDeleteArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PriceAlert.
     * @param {PriceAlertUpdateArgs} args - Arguments to update one PriceAlert.
     * @example
     * // Update one PriceAlert
     * const priceAlert = await prisma.priceAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PriceAlertUpdateArgs>(args: SelectSubset<T, PriceAlertUpdateArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PriceAlerts.
     * @param {PriceAlertDeleteManyArgs} args - Arguments to filter PriceAlerts to delete.
     * @example
     * // Delete a few PriceAlerts
     * const { count } = await prisma.priceAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PriceAlertDeleteManyArgs>(args?: SelectSubset<T, PriceAlertDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PriceAlerts
     * const priceAlert = await prisma.priceAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PriceAlertUpdateManyArgs>(args: SelectSubset<T, PriceAlertUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PriceAlerts and returns the data updated in the database.
     * @param {PriceAlertUpdateManyAndReturnArgs} args - Arguments to update many PriceAlerts.
     * @example
     * // Update many PriceAlerts
     * const priceAlert = await prisma.priceAlert.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PriceAlerts and only return the `id`
     * const priceAlertWithIdOnly = await prisma.priceAlert.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PriceAlertUpdateManyAndReturnArgs>(args: SelectSubset<T, PriceAlertUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PriceAlert.
     * @param {PriceAlertUpsertArgs} args - Arguments to update or create a PriceAlert.
     * @example
     * // Update or create a PriceAlert
     * const priceAlert = await prisma.priceAlert.upsert({
     *   create: {
     *     // ... data to create a PriceAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PriceAlert we want to update
     *   }
     * })
     */
    upsert<T extends PriceAlertUpsertArgs>(args: SelectSubset<T, PriceAlertUpsertArgs<ExtArgs>>): Prisma__PriceAlertClient<$Result.GetResult<Prisma.$PriceAlertPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PriceAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertCountArgs} args - Arguments to filter PriceAlerts to count.
     * @example
     * // Count the number of PriceAlerts
     * const count = await prisma.priceAlert.count({
     *   where: {
     *     // ... the filter for the PriceAlerts we want to count
     *   }
     * })
    **/
    count<T extends PriceAlertCountArgs>(
      args?: Subset<T, PriceAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PriceAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PriceAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PriceAlertAggregateArgs>(args: Subset<T, PriceAlertAggregateArgs>): Prisma.PrismaPromise<GetPriceAlertAggregateType<T>>

    /**
     * Group by PriceAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PriceAlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PriceAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PriceAlertGroupByArgs['orderBy'] }
        : { orderBy?: PriceAlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PriceAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPriceAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PriceAlert model
   */
  readonly fields: PriceAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PriceAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PriceAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    position<T extends PriceAlert$positionArgs<ExtArgs> = {}>(args?: Subset<T, PriceAlert$positionArgs<ExtArgs>>): Prisma__TradingPositionClient<$Result.GetResult<Prisma.$TradingPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PriceAlert model
   */
  interface PriceAlertFieldRefs {
    readonly id: FieldRef<"PriceAlert", 'String'>
    readonly positionId: FieldRef<"PriceAlert", 'String'>
    readonly userWalletAddress: FieldRef<"PriceAlert", 'String'>
    readonly tokenAddress: FieldRef<"PriceAlert", 'String'>
    readonly alertType: FieldRef<"PriceAlert", 'String'>
    readonly targetPrice: FieldRef<"PriceAlert", 'Decimal'>
    readonly isActive: FieldRef<"PriceAlert", 'Boolean'>
    readonly triggeredAt: FieldRef<"PriceAlert", 'DateTime'>
    readonly createdAt: FieldRef<"PriceAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PriceAlert findUnique
   */
  export type PriceAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * Filter, which PriceAlert to fetch.
     */
    where: PriceAlertWhereUniqueInput
  }

  /**
   * PriceAlert findUniqueOrThrow
   */
  export type PriceAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * Filter, which PriceAlert to fetch.
     */
    where: PriceAlertWhereUniqueInput
  }

  /**
   * PriceAlert findFirst
   */
  export type PriceAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * Filter, which PriceAlert to fetch.
     */
    where?: PriceAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceAlerts to fetch.
     */
    orderBy?: PriceAlertOrderByWithRelationInput | PriceAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceAlerts.
     */
    cursor?: PriceAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceAlerts.
     */
    distinct?: PriceAlertScalarFieldEnum | PriceAlertScalarFieldEnum[]
  }

  /**
   * PriceAlert findFirstOrThrow
   */
  export type PriceAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * Filter, which PriceAlert to fetch.
     */
    where?: PriceAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceAlerts to fetch.
     */
    orderBy?: PriceAlertOrderByWithRelationInput | PriceAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PriceAlerts.
     */
    cursor?: PriceAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PriceAlerts.
     */
    distinct?: PriceAlertScalarFieldEnum | PriceAlertScalarFieldEnum[]
  }

  /**
   * PriceAlert findMany
   */
  export type PriceAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * Filter, which PriceAlerts to fetch.
     */
    where?: PriceAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PriceAlerts to fetch.
     */
    orderBy?: PriceAlertOrderByWithRelationInput | PriceAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PriceAlerts.
     */
    cursor?: PriceAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PriceAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PriceAlerts.
     */
    skip?: number
    distinct?: PriceAlertScalarFieldEnum | PriceAlertScalarFieldEnum[]
  }

  /**
   * PriceAlert create
   */
  export type PriceAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * The data needed to create a PriceAlert.
     */
    data: XOR<PriceAlertCreateInput, PriceAlertUncheckedCreateInput>
  }

  /**
   * PriceAlert createMany
   */
  export type PriceAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PriceAlerts.
     */
    data: PriceAlertCreateManyInput | PriceAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PriceAlert createManyAndReturn
   */
  export type PriceAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * The data used to create many PriceAlerts.
     */
    data: PriceAlertCreateManyInput | PriceAlertCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriceAlert update
   */
  export type PriceAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * The data needed to update a PriceAlert.
     */
    data: XOR<PriceAlertUpdateInput, PriceAlertUncheckedUpdateInput>
    /**
     * Choose, which PriceAlert to update.
     */
    where: PriceAlertWhereUniqueInput
  }

  /**
   * PriceAlert updateMany
   */
  export type PriceAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PriceAlerts.
     */
    data: XOR<PriceAlertUpdateManyMutationInput, PriceAlertUncheckedUpdateManyInput>
    /**
     * Filter which PriceAlerts to update
     */
    where?: PriceAlertWhereInput
    /**
     * Limit how many PriceAlerts to update.
     */
    limit?: number
  }

  /**
   * PriceAlert updateManyAndReturn
   */
  export type PriceAlertUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * The data used to update PriceAlerts.
     */
    data: XOR<PriceAlertUpdateManyMutationInput, PriceAlertUncheckedUpdateManyInput>
    /**
     * Filter which PriceAlerts to update
     */
    where?: PriceAlertWhereInput
    /**
     * Limit how many PriceAlerts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PriceAlert upsert
   */
  export type PriceAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * The filter to search for the PriceAlert to update in case it exists.
     */
    where: PriceAlertWhereUniqueInput
    /**
     * In case the PriceAlert found by the `where` argument doesn't exist, create a new PriceAlert with this data.
     */
    create: XOR<PriceAlertCreateInput, PriceAlertUncheckedCreateInput>
    /**
     * In case the PriceAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PriceAlertUpdateInput, PriceAlertUncheckedUpdateInput>
  }

  /**
   * PriceAlert delete
   */
  export type PriceAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
    /**
     * Filter which PriceAlert to delete.
     */
    where: PriceAlertWhereUniqueInput
  }

  /**
   * PriceAlert deleteMany
   */
  export type PriceAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PriceAlerts to delete
     */
    where?: PriceAlertWhereInput
    /**
     * Limit how many PriceAlerts to delete.
     */
    limit?: number
  }

  /**
   * PriceAlert.position
   */
  export type PriceAlert$positionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TradingPosition
     */
    select?: TradingPositionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TradingPosition
     */
    omit?: TradingPositionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TradingPositionInclude<ExtArgs> | null
    where?: TradingPositionWhereInput
  }

  /**
   * PriceAlert without action
   */
  export type PriceAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PriceAlert
     */
    select?: PriceAlertSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PriceAlert
     */
    omit?: PriceAlertOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PriceAlertInclude<ExtArgs> | null
  }


  /**
   * Model AuditLog
   */

  export type AggregateAuditLog = {
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  export type AuditLogMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    eventType: string | null
    entityType: string | null
    entityId: string | null
    userId: string | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type AuditLogMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    eventType: string | null
    entityType: string | null
    entityId: string | null
    userId: string | null
    ipAddress: string | null
    userAgent: string | null
  }

  export type AuditLogCountAggregateOutputType = {
    id: number
    createdAt: number
    eventType: number
    entityType: number
    entityId: number
    userId: number
    details: number
    ipAddress: number
    userAgent: number
    _all: number
  }


  export type AuditLogMinAggregateInputType = {
    id?: true
    createdAt?: true
    eventType?: true
    entityType?: true
    entityId?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
  }

  export type AuditLogMaxAggregateInputType = {
    id?: true
    createdAt?: true
    eventType?: true
    entityType?: true
    entityId?: true
    userId?: true
    ipAddress?: true
    userAgent?: true
  }

  export type AuditLogCountAggregateInputType = {
    id?: true
    createdAt?: true
    eventType?: true
    entityType?: true
    entityId?: true
    userId?: true
    details?: true
    ipAddress?: true
    userAgent?: true
    _all?: true
  }

  export type AuditLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLog to aggregate.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AuditLogs
    **/
    _count?: true | AuditLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AuditLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AuditLogMaxAggregateInputType
  }

  export type GetAuditLogAggregateType<T extends AuditLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAuditLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuditLog[P]>
      : GetScalarType<T[P], AggregateAuditLog[P]>
  }




  export type AuditLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AuditLogWhereInput
    orderBy?: AuditLogOrderByWithAggregationInput | AuditLogOrderByWithAggregationInput[]
    by: AuditLogScalarFieldEnum[] | AuditLogScalarFieldEnum
    having?: AuditLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AuditLogCountAggregateInputType | true
    _min?: AuditLogMinAggregateInputType
    _max?: AuditLogMaxAggregateInputType
  }

  export type AuditLogGroupByOutputType = {
    id: string
    createdAt: Date
    eventType: string
    entityType: string
    entityId: string | null
    userId: string | null
    details: JsonValue | null
    ipAddress: string | null
    userAgent: string | null
    _count: AuditLogCountAggregateOutputType | null
    _min: AuditLogMinAggregateOutputType | null
    _max: AuditLogMaxAggregateOutputType | null
  }

  type GetAuditLogGroupByPayload<T extends AuditLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AuditLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AuditLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
            : GetScalarType<T[P], AuditLogGroupByOutputType[P]>
        }
      >
    >


  export type AuditLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    details?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    details?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    details?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }, ExtArgs["result"]["auditLog"]>

  export type AuditLogSelectScalar = {
    id?: boolean
    createdAt?: boolean
    eventType?: boolean
    entityType?: boolean
    entityId?: boolean
    userId?: boolean
    details?: boolean
    ipAddress?: boolean
    userAgent?: boolean
  }

  export type AuditLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "eventType" | "entityType" | "entityId" | "userId" | "details" | "ipAddress" | "userAgent", ExtArgs["result"]["auditLog"]>

  export type $AuditLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AuditLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      eventType: string
      entityType: string
      entityId: string | null
      userId: string | null
      details: Prisma.JsonValue | null
      ipAddress: string | null
      userAgent: string | null
    }, ExtArgs["result"]["auditLog"]>
    composites: {}
  }

  type AuditLogGetPayload<S extends boolean | null | undefined | AuditLogDefaultArgs> = $Result.GetResult<Prisma.$AuditLogPayload, S>

  type AuditLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AuditLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AuditLogCountAggregateInputType | true
    }

  export interface AuditLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AuditLog'], meta: { name: 'AuditLog' } }
    /**
     * Find zero or one AuditLog that matches the filter.
     * @param {AuditLogFindUniqueArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AuditLogFindUniqueArgs>(args: SelectSubset<T, AuditLogFindUniqueArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AuditLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AuditLogFindUniqueOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AuditLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AuditLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AuditLogFindFirstArgs>(args?: SelectSubset<T, AuditLogFindFirstArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AuditLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindFirstOrThrowArgs} args - Arguments to find a AuditLog
     * @example
     * // Get one AuditLog
     * const auditLog = await prisma.auditLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AuditLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AuditLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AuditLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AuditLogs
     * const auditLogs = await prisma.auditLog.findMany()
     * 
     * // Get first 10 AuditLogs
     * const auditLogs = await prisma.auditLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AuditLogFindManyArgs>(args?: SelectSubset<T, AuditLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AuditLog.
     * @param {AuditLogCreateArgs} args - Arguments to create a AuditLog.
     * @example
     * // Create one AuditLog
     * const AuditLog = await prisma.auditLog.create({
     *   data: {
     *     // ... data to create a AuditLog
     *   }
     * })
     * 
     */
    create<T extends AuditLogCreateArgs>(args: SelectSubset<T, AuditLogCreateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AuditLogs.
     * @param {AuditLogCreateManyArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AuditLogCreateManyArgs>(args?: SelectSubset<T, AuditLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AuditLogs and returns the data saved in the database.
     * @param {AuditLogCreateManyAndReturnArgs} args - Arguments to create many AuditLogs.
     * @example
     * // Create many AuditLogs
     * const auditLog = await prisma.auditLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AuditLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AuditLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AuditLog.
     * @param {AuditLogDeleteArgs} args - Arguments to delete one AuditLog.
     * @example
     * // Delete one AuditLog
     * const AuditLog = await prisma.auditLog.delete({
     *   where: {
     *     // ... filter to delete one AuditLog
     *   }
     * })
     * 
     */
    delete<T extends AuditLogDeleteArgs>(args: SelectSubset<T, AuditLogDeleteArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AuditLog.
     * @param {AuditLogUpdateArgs} args - Arguments to update one AuditLog.
     * @example
     * // Update one AuditLog
     * const auditLog = await prisma.auditLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AuditLogUpdateArgs>(args: SelectSubset<T, AuditLogUpdateArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AuditLogs.
     * @param {AuditLogDeleteManyArgs} args - Arguments to filter AuditLogs to delete.
     * @example
     * // Delete a few AuditLogs
     * const { count } = await prisma.auditLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AuditLogDeleteManyArgs>(args?: SelectSubset<T, AuditLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AuditLogUpdateManyArgs>(args: SelectSubset<T, AuditLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AuditLogs and returns the data updated in the database.
     * @param {AuditLogUpdateManyAndReturnArgs} args - Arguments to update many AuditLogs.
     * @example
     * // Update many AuditLogs
     * const auditLog = await prisma.auditLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AuditLogs and only return the `id`
     * const auditLogWithIdOnly = await prisma.auditLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AuditLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AuditLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AuditLog.
     * @param {AuditLogUpsertArgs} args - Arguments to update or create a AuditLog.
     * @example
     * // Update or create a AuditLog
     * const auditLog = await prisma.auditLog.upsert({
     *   create: {
     *     // ... data to create a AuditLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AuditLog we want to update
     *   }
     * })
     */
    upsert<T extends AuditLogUpsertArgs>(args: SelectSubset<T, AuditLogUpsertArgs<ExtArgs>>): Prisma__AuditLogClient<$Result.GetResult<Prisma.$AuditLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AuditLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogCountArgs} args - Arguments to filter AuditLogs to count.
     * @example
     * // Count the number of AuditLogs
     * const count = await prisma.auditLog.count({
     *   where: {
     *     // ... the filter for the AuditLogs we want to count
     *   }
     * })
    **/
    count<T extends AuditLogCountArgs>(
      args?: Subset<T, AuditLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AuditLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AuditLogAggregateArgs>(args: Subset<T, AuditLogAggregateArgs>): Prisma.PrismaPromise<GetAuditLogAggregateType<T>>

    /**
     * Group by AuditLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AuditLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AuditLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AuditLogGroupByArgs['orderBy'] }
        : { orderBy?: AuditLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AuditLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuditLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AuditLog model
   */
  readonly fields: AuditLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AuditLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AuditLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AuditLog model
   */
  interface AuditLogFieldRefs {
    readonly id: FieldRef<"AuditLog", 'String'>
    readonly createdAt: FieldRef<"AuditLog", 'DateTime'>
    readonly eventType: FieldRef<"AuditLog", 'String'>
    readonly entityType: FieldRef<"AuditLog", 'String'>
    readonly entityId: FieldRef<"AuditLog", 'String'>
    readonly userId: FieldRef<"AuditLog", 'String'>
    readonly details: FieldRef<"AuditLog", 'Json'>
    readonly ipAddress: FieldRef<"AuditLog", 'String'>
    readonly userAgent: FieldRef<"AuditLog", 'String'>
  }
    

  // Custom InputTypes
  /**
   * AuditLog findUnique
   */
  export type AuditLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findUniqueOrThrow
   */
  export type AuditLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog findFirst
   */
  export type AuditLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findFirstOrThrow
   */
  export type AuditLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLog to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AuditLogs.
     */
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog findMany
   */
  export type AuditLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter, which AuditLogs to fetch.
     */
    where?: AuditLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AuditLogs to fetch.
     */
    orderBy?: AuditLogOrderByWithRelationInput | AuditLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AuditLogs.
     */
    cursor?: AuditLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AuditLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AuditLogs.
     */
    skip?: number
    distinct?: AuditLogScalarFieldEnum | AuditLogScalarFieldEnum[]
  }

  /**
   * AuditLog create
   */
  export type AuditLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AuditLog.
     */
    data: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
  }

  /**
   * AuditLog createMany
   */
  export type AuditLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog createManyAndReturn
   */
  export type AuditLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to create many AuditLogs.
     */
    data: AuditLogCreateManyInput | AuditLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * AuditLog update
   */
  export type AuditLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AuditLog.
     */
    data: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
    /**
     * Choose, which AuditLog to update.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog updateMany
   */
  export type AuditLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog updateManyAndReturn
   */
  export type AuditLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The data used to update AuditLogs.
     */
    data: XOR<AuditLogUpdateManyMutationInput, AuditLogUncheckedUpdateManyInput>
    /**
     * Filter which AuditLogs to update
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to update.
     */
    limit?: number
  }

  /**
   * AuditLog upsert
   */
  export type AuditLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AuditLog to update in case it exists.
     */
    where: AuditLogWhereUniqueInput
    /**
     * In case the AuditLog found by the `where` argument doesn't exist, create a new AuditLog with this data.
     */
    create: XOR<AuditLogCreateInput, AuditLogUncheckedCreateInput>
    /**
     * In case the AuditLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AuditLogUpdateInput, AuditLogUncheckedUpdateInput>
  }

  /**
   * AuditLog delete
   */
  export type AuditLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
    /**
     * Filter which AuditLog to delete.
     */
    where: AuditLogWhereUniqueInput
  }

  /**
   * AuditLog deleteMany
   */
  export type AuditLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AuditLogs to delete
     */
    where?: AuditLogWhereInput
    /**
     * Limit how many AuditLogs to delete.
     */
    limit?: number
  }

  /**
   * AuditLog without action
   */
  export type AuditLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AuditLog
     */
    select?: AuditLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AuditLog
     */
    omit?: AuditLogOmit<ExtArgs> | null
  }


  /**
   * Model IngestionRun
   */

  export type AggregateIngestionRun = {
    _count: IngestionRunCountAggregateOutputType | null
    _avg: IngestionRunAvgAggregateOutputType | null
    _sum: IngestionRunSumAggregateOutputType | null
    _min: IngestionRunMinAggregateOutputType | null
    _max: IngestionRunMaxAggregateOutputType | null
  }

  export type IngestionRunAvgAggregateOutputType = {
    tokensProcessed: number | null
    rowsInserted: number | null
  }

  export type IngestionRunSumAggregateOutputType = {
    tokensProcessed: number | null
    rowsInserted: number | null
  }

  export type IngestionRunMinAggregateOutputType = {
    runId: string | null
    startedAt: Date | null
    endedAt: Date | null
    ok: boolean | null
    tokensProcessed: number | null
    rowsInserted: number | null
    errorMessage: string | null
    dataType: string | null
  }

  export type IngestionRunMaxAggregateOutputType = {
    runId: string | null
    startedAt: Date | null
    endedAt: Date | null
    ok: boolean | null
    tokensProcessed: number | null
    rowsInserted: number | null
    errorMessage: string | null
    dataType: string | null
  }

  export type IngestionRunCountAggregateOutputType = {
    runId: number
    startedAt: number
    endedAt: number
    ok: number
    tokensProcessed: number
    rowsInserted: number
    vendorRateStatus: number
    errorMessage: number
    dataType: number
    _all: number
  }


  export type IngestionRunAvgAggregateInputType = {
    tokensProcessed?: true
    rowsInserted?: true
  }

  export type IngestionRunSumAggregateInputType = {
    tokensProcessed?: true
    rowsInserted?: true
  }

  export type IngestionRunMinAggregateInputType = {
    runId?: true
    startedAt?: true
    endedAt?: true
    ok?: true
    tokensProcessed?: true
    rowsInserted?: true
    errorMessage?: true
    dataType?: true
  }

  export type IngestionRunMaxAggregateInputType = {
    runId?: true
    startedAt?: true
    endedAt?: true
    ok?: true
    tokensProcessed?: true
    rowsInserted?: true
    errorMessage?: true
    dataType?: true
  }

  export type IngestionRunCountAggregateInputType = {
    runId?: true
    startedAt?: true
    endedAt?: true
    ok?: true
    tokensProcessed?: true
    rowsInserted?: true
    vendorRateStatus?: true
    errorMessage?: true
    dataType?: true
    _all?: true
  }

  export type IngestionRunAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestionRun to aggregate.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned IngestionRuns
    **/
    _count?: true | IngestionRunCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: IngestionRunAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: IngestionRunSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IngestionRunMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IngestionRunMaxAggregateInputType
  }

  export type GetIngestionRunAggregateType<T extends IngestionRunAggregateArgs> = {
        [P in keyof T & keyof AggregateIngestionRun]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIngestionRun[P]>
      : GetScalarType<T[P], AggregateIngestionRun[P]>
  }




  export type IngestionRunGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IngestionRunWhereInput
    orderBy?: IngestionRunOrderByWithAggregationInput | IngestionRunOrderByWithAggregationInput[]
    by: IngestionRunScalarFieldEnum[] | IngestionRunScalarFieldEnum
    having?: IngestionRunScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IngestionRunCountAggregateInputType | true
    _avg?: IngestionRunAvgAggregateInputType
    _sum?: IngestionRunSumAggregateInputType
    _min?: IngestionRunMinAggregateInputType
    _max?: IngestionRunMaxAggregateInputType
  }

  export type IngestionRunGroupByOutputType = {
    runId: string
    startedAt: Date
    endedAt: Date | null
    ok: boolean | null
    tokensProcessed: number | null
    rowsInserted: number | null
    vendorRateStatus: JsonValue | null
    errorMessage: string | null
    dataType: string
    _count: IngestionRunCountAggregateOutputType | null
    _avg: IngestionRunAvgAggregateOutputType | null
    _sum: IngestionRunSumAggregateOutputType | null
    _min: IngestionRunMinAggregateOutputType | null
    _max: IngestionRunMaxAggregateOutputType | null
  }

  type GetIngestionRunGroupByPayload<T extends IngestionRunGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IngestionRunGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IngestionRunGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IngestionRunGroupByOutputType[P]>
            : GetScalarType<T[P], IngestionRunGroupByOutputType[P]>
        }
      >
    >


  export type IngestionRunSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    runId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    ok?: boolean
    tokensProcessed?: boolean
    rowsInserted?: boolean
    vendorRateStatus?: boolean
    errorMessage?: boolean
    dataType?: boolean
  }, ExtArgs["result"]["ingestionRun"]>

  export type IngestionRunSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    runId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    ok?: boolean
    tokensProcessed?: boolean
    rowsInserted?: boolean
    vendorRateStatus?: boolean
    errorMessage?: boolean
    dataType?: boolean
  }, ExtArgs["result"]["ingestionRun"]>

  export type IngestionRunSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    runId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    ok?: boolean
    tokensProcessed?: boolean
    rowsInserted?: boolean
    vendorRateStatus?: boolean
    errorMessage?: boolean
    dataType?: boolean
  }, ExtArgs["result"]["ingestionRun"]>

  export type IngestionRunSelectScalar = {
    runId?: boolean
    startedAt?: boolean
    endedAt?: boolean
    ok?: boolean
    tokensProcessed?: boolean
    rowsInserted?: boolean
    vendorRateStatus?: boolean
    errorMessage?: boolean
    dataType?: boolean
  }

  export type IngestionRunOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"runId" | "startedAt" | "endedAt" | "ok" | "tokensProcessed" | "rowsInserted" | "vendorRateStatus" | "errorMessage" | "dataType", ExtArgs["result"]["ingestionRun"]>

  export type $IngestionRunPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "IngestionRun"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      runId: string
      startedAt: Date
      endedAt: Date | null
      ok: boolean | null
      tokensProcessed: number | null
      rowsInserted: number | null
      vendorRateStatus: Prisma.JsonValue | null
      errorMessage: string | null
      dataType: string
    }, ExtArgs["result"]["ingestionRun"]>
    composites: {}
  }

  type IngestionRunGetPayload<S extends boolean | null | undefined | IngestionRunDefaultArgs> = $Result.GetResult<Prisma.$IngestionRunPayload, S>

  type IngestionRunCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<IngestionRunFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: IngestionRunCountAggregateInputType | true
    }

  export interface IngestionRunDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['IngestionRun'], meta: { name: 'IngestionRun' } }
    /**
     * Find zero or one IngestionRun that matches the filter.
     * @param {IngestionRunFindUniqueArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IngestionRunFindUniqueArgs>(args: SelectSubset<T, IngestionRunFindUniqueArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one IngestionRun that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {IngestionRunFindUniqueOrThrowArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IngestionRunFindUniqueOrThrowArgs>(args: SelectSubset<T, IngestionRunFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestionRun that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunFindFirstArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IngestionRunFindFirstArgs>(args?: SelectSubset<T, IngestionRunFindFirstArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first IngestionRun that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunFindFirstOrThrowArgs} args - Arguments to find a IngestionRun
     * @example
     * // Get one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IngestionRunFindFirstOrThrowArgs>(args?: SelectSubset<T, IngestionRunFindFirstOrThrowArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more IngestionRuns that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all IngestionRuns
     * const ingestionRuns = await prisma.ingestionRun.findMany()
     * 
     * // Get first 10 IngestionRuns
     * const ingestionRuns = await prisma.ingestionRun.findMany({ take: 10 })
     * 
     * // Only select the `runId`
     * const ingestionRunWithRunIdOnly = await prisma.ingestionRun.findMany({ select: { runId: true } })
     * 
     */
    findMany<T extends IngestionRunFindManyArgs>(args?: SelectSubset<T, IngestionRunFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a IngestionRun.
     * @param {IngestionRunCreateArgs} args - Arguments to create a IngestionRun.
     * @example
     * // Create one IngestionRun
     * const IngestionRun = await prisma.ingestionRun.create({
     *   data: {
     *     // ... data to create a IngestionRun
     *   }
     * })
     * 
     */
    create<T extends IngestionRunCreateArgs>(args: SelectSubset<T, IngestionRunCreateArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many IngestionRuns.
     * @param {IngestionRunCreateManyArgs} args - Arguments to create many IngestionRuns.
     * @example
     * // Create many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IngestionRunCreateManyArgs>(args?: SelectSubset<T, IngestionRunCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many IngestionRuns and returns the data saved in the database.
     * @param {IngestionRunCreateManyAndReturnArgs} args - Arguments to create many IngestionRuns.
     * @example
     * // Create many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many IngestionRuns and only return the `runId`
     * const ingestionRunWithRunIdOnly = await prisma.ingestionRun.createManyAndReturn({
     *   select: { runId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends IngestionRunCreateManyAndReturnArgs>(args?: SelectSubset<T, IngestionRunCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a IngestionRun.
     * @param {IngestionRunDeleteArgs} args - Arguments to delete one IngestionRun.
     * @example
     * // Delete one IngestionRun
     * const IngestionRun = await prisma.ingestionRun.delete({
     *   where: {
     *     // ... filter to delete one IngestionRun
     *   }
     * })
     * 
     */
    delete<T extends IngestionRunDeleteArgs>(args: SelectSubset<T, IngestionRunDeleteArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one IngestionRun.
     * @param {IngestionRunUpdateArgs} args - Arguments to update one IngestionRun.
     * @example
     * // Update one IngestionRun
     * const ingestionRun = await prisma.ingestionRun.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IngestionRunUpdateArgs>(args: SelectSubset<T, IngestionRunUpdateArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more IngestionRuns.
     * @param {IngestionRunDeleteManyArgs} args - Arguments to filter IngestionRuns to delete.
     * @example
     * // Delete a few IngestionRuns
     * const { count } = await prisma.ingestionRun.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IngestionRunDeleteManyArgs>(args?: SelectSubset<T, IngestionRunDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestionRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IngestionRunUpdateManyArgs>(args: SelectSubset<T, IngestionRunUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more IngestionRuns and returns the data updated in the database.
     * @param {IngestionRunUpdateManyAndReturnArgs} args - Arguments to update many IngestionRuns.
     * @example
     * // Update many IngestionRuns
     * const ingestionRun = await prisma.ingestionRun.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more IngestionRuns and only return the `runId`
     * const ingestionRunWithRunIdOnly = await prisma.ingestionRun.updateManyAndReturn({
     *   select: { runId: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends IngestionRunUpdateManyAndReturnArgs>(args: SelectSubset<T, IngestionRunUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one IngestionRun.
     * @param {IngestionRunUpsertArgs} args - Arguments to update or create a IngestionRun.
     * @example
     * // Update or create a IngestionRun
     * const ingestionRun = await prisma.ingestionRun.upsert({
     *   create: {
     *     // ... data to create a IngestionRun
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the IngestionRun we want to update
     *   }
     * })
     */
    upsert<T extends IngestionRunUpsertArgs>(args: SelectSubset<T, IngestionRunUpsertArgs<ExtArgs>>): Prisma__IngestionRunClient<$Result.GetResult<Prisma.$IngestionRunPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of IngestionRuns.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunCountArgs} args - Arguments to filter IngestionRuns to count.
     * @example
     * // Count the number of IngestionRuns
     * const count = await prisma.ingestionRun.count({
     *   where: {
     *     // ... the filter for the IngestionRuns we want to count
     *   }
     * })
    **/
    count<T extends IngestionRunCountArgs>(
      args?: Subset<T, IngestionRunCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IngestionRunCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a IngestionRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IngestionRunAggregateArgs>(args: Subset<T, IngestionRunAggregateArgs>): Prisma.PrismaPromise<GetIngestionRunAggregateType<T>>

    /**
     * Group by IngestionRun.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IngestionRunGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IngestionRunGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IngestionRunGroupByArgs['orderBy'] }
        : { orderBy?: IngestionRunGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IngestionRunGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIngestionRunGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the IngestionRun model
   */
  readonly fields: IngestionRunFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for IngestionRun.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IngestionRunClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the IngestionRun model
   */
  interface IngestionRunFieldRefs {
    readonly runId: FieldRef<"IngestionRun", 'String'>
    readonly startedAt: FieldRef<"IngestionRun", 'DateTime'>
    readonly endedAt: FieldRef<"IngestionRun", 'DateTime'>
    readonly ok: FieldRef<"IngestionRun", 'Boolean'>
    readonly tokensProcessed: FieldRef<"IngestionRun", 'Int'>
    readonly rowsInserted: FieldRef<"IngestionRun", 'Int'>
    readonly vendorRateStatus: FieldRef<"IngestionRun", 'Json'>
    readonly errorMessage: FieldRef<"IngestionRun", 'String'>
    readonly dataType: FieldRef<"IngestionRun", 'String'>
  }
    

  // Custom InputTypes
  /**
   * IngestionRun findUnique
   */
  export type IngestionRunFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun findUniqueOrThrow
   */
  export type IngestionRunFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun findFirst
   */
  export type IngestionRunFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestionRuns.
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestionRuns.
     */
    distinct?: IngestionRunScalarFieldEnum | IngestionRunScalarFieldEnum[]
  }

  /**
   * IngestionRun findFirstOrThrow
   */
  export type IngestionRunFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Filter, which IngestionRun to fetch.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for IngestionRuns.
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of IngestionRuns.
     */
    distinct?: IngestionRunScalarFieldEnum | IngestionRunScalarFieldEnum[]
  }

  /**
   * IngestionRun findMany
   */
  export type IngestionRunFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Filter, which IngestionRuns to fetch.
     */
    where?: IngestionRunWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of IngestionRuns to fetch.
     */
    orderBy?: IngestionRunOrderByWithRelationInput | IngestionRunOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing IngestionRuns.
     */
    cursor?: IngestionRunWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` IngestionRuns from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` IngestionRuns.
     */
    skip?: number
    distinct?: IngestionRunScalarFieldEnum | IngestionRunScalarFieldEnum[]
  }

  /**
   * IngestionRun create
   */
  export type IngestionRunCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The data needed to create a IngestionRun.
     */
    data?: XOR<IngestionRunCreateInput, IngestionRunUncheckedCreateInput>
  }

  /**
   * IngestionRun createMany
   */
  export type IngestionRunCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many IngestionRuns.
     */
    data: IngestionRunCreateManyInput | IngestionRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestionRun createManyAndReturn
   */
  export type IngestionRunCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The data used to create many IngestionRuns.
     */
    data: IngestionRunCreateManyInput | IngestionRunCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * IngestionRun update
   */
  export type IngestionRunUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The data needed to update a IngestionRun.
     */
    data: XOR<IngestionRunUpdateInput, IngestionRunUncheckedUpdateInput>
    /**
     * Choose, which IngestionRun to update.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun updateMany
   */
  export type IngestionRunUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update IngestionRuns.
     */
    data: XOR<IngestionRunUpdateManyMutationInput, IngestionRunUncheckedUpdateManyInput>
    /**
     * Filter which IngestionRuns to update
     */
    where?: IngestionRunWhereInput
    /**
     * Limit how many IngestionRuns to update.
     */
    limit?: number
  }

  /**
   * IngestionRun updateManyAndReturn
   */
  export type IngestionRunUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The data used to update IngestionRuns.
     */
    data: XOR<IngestionRunUpdateManyMutationInput, IngestionRunUncheckedUpdateManyInput>
    /**
     * Filter which IngestionRuns to update
     */
    where?: IngestionRunWhereInput
    /**
     * Limit how many IngestionRuns to update.
     */
    limit?: number
  }

  /**
   * IngestionRun upsert
   */
  export type IngestionRunUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * The filter to search for the IngestionRun to update in case it exists.
     */
    where: IngestionRunWhereUniqueInput
    /**
     * In case the IngestionRun found by the `where` argument doesn't exist, create a new IngestionRun with this data.
     */
    create: XOR<IngestionRunCreateInput, IngestionRunUncheckedCreateInput>
    /**
     * In case the IngestionRun was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IngestionRunUpdateInput, IngestionRunUncheckedUpdateInput>
  }

  /**
   * IngestionRun delete
   */
  export type IngestionRunDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
    /**
     * Filter which IngestionRun to delete.
     */
    where: IngestionRunWhereUniqueInput
  }

  /**
   * IngestionRun deleteMany
   */
  export type IngestionRunDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which IngestionRuns to delete
     */
    where?: IngestionRunWhereInput
    /**
     * Limit how many IngestionRuns to delete.
     */
    limit?: number
  }

  /**
   * IngestionRun without action
   */
  export type IngestionRunDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the IngestionRun
     */
    select?: IngestionRunSelect<ExtArgs> | null
    /**
     * Omit specific fields from the IngestionRun
     */
    omit?: IngestionRunOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CallScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    messageId: 'messageId',
    rawMessage: 'rawMessage',
    messageTimestamp: 'messageTimestamp',
    tokenSymbol: 'tokenSymbol',
    tokenName: 'tokenName',
    contractAddress: 'contractAddress',
    blockchain: 'blockchain',
    sqdgnLabel: 'sqdgnLabel',
    callType: 'callType',
    marketCap: 'marketCap',
    liquidity: 'liquidity',
    volume24h: 'volume24h',
    currentPriceUsd: 'currentPriceUsd',
    priceUpdatedAt: 'priceUpdatedAt',
    currentMarketCap: 'currentMarketCap',
    marketCapUpdatedAt: 'marketCapUpdatedAt',
    dexScreenerUrl: 'dexScreenerUrl',
    jupiterUrl: 'jupiterUrl',
    raydiumUrl: 'raydiumUrl',
    metadata: 'metadata',
    isValid: 'isValid',
    parsedAt: 'parsedAt'
  };

  export type CallScalarFieldEnum = (typeof CallScalarFieldEnum)[keyof typeof CallScalarFieldEnum]


  export const TokenPriceSnapshotScalarFieldEnum: {
    time: 'time',
    tokenAddress: 'tokenAddress',
    priceUsd: 'priceUsd',
    priceNative: 'priceNative',
    marketCap: 'marketCap',
    volume5m: 'volume5m',
    volume1h: 'volume1h',
    volume24h: 'volume24h',
    liquidityUsd: 'liquidityUsd',
    priceChange5m: 'priceChange5m',
    priceChange1h: 'priceChange1h',
    priceChange24h: 'priceChange24h',
    txnBuys5m: 'txnBuys5m',
    txnSells5m: 'txnSells5m',
    dexId: 'dexId',
    pairAddress: 'pairAddress',
    source: 'source',
    createdAt: 'createdAt'
  };

  export type TokenPriceSnapshotScalarFieldEnum = (typeof TokenPriceSnapshotScalarFieldEnum)[keyof typeof TokenPriceSnapshotScalarFieldEnum]


  export const TradingPositionScalarFieldEnum: {
    id: 'id',
    userWalletAddress: 'userWalletAddress',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    entryPrice: 'entryPrice',
    entryAmountSol: 'entryAmountSol',
    entryAmountTokens: 'entryAmountTokens',
    entryTxSignature: 'entryTxSignature',
    currentPrice: 'currentPrice',
    currentValueSol: 'currentValueSol',
    highestPrice: 'highestPrice',
    realizedPnlSol: 'realizedPnlSol',
    unrealizedPnlSol: 'unrealizedPnlSol',
    unrealizedPnlPercentage: 'unrealizedPnlPercentage',
    stopLossPrice: 'stopLossPrice',
    takeProfitPrice: 'takeProfitPrice',
    trailingStopPercentage: 'trailingStopPercentage',
    exitPrice: 'exitPrice',
    exitAmountSol: 'exitAmountSol',
    exitReason: 'exitReason',
    exitTxSignature: 'exitTxSignature',
    status: 'status',
    openedAt: 'openedAt',
    closedAt: 'closedAt',
    lastUpdated: 'lastUpdated',
    callId: 'callId'
  };

  export type TradingPositionScalarFieldEnum = (typeof TradingPositionScalarFieldEnum)[keyof typeof TradingPositionScalarFieldEnum]


  export const TrailingStopScalarFieldEnum: {
    id: 'id',
    positionId: 'positionId',
    highestPrice: 'highestPrice',
    currentStopPrice: 'currentStopPrice',
    trailingPercentage: 'trailingPercentage',
    isActive: 'isActive',
    lastCheckedAt: 'lastCheckedAt',
    triggeredAt: 'triggeredAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TrailingStopScalarFieldEnum = (typeof TrailingStopScalarFieldEnum)[keyof typeof TrailingStopScalarFieldEnum]


  export const UserTradingConfigScalarFieldEnum: {
    id: 'id',
    userWalletAddress: 'userWalletAddress',
    telegramUserId: 'telegramUserId',
    isAutoBuyEnabled: 'isAutoBuyEnabled',
    defaultBuyAmountSol: 'defaultBuyAmountSol',
    maxPositionSizeSol: 'maxPositionSizeSol',
    defaultSlippageBps: 'defaultSlippageBps',
    maxSlippageBps: 'maxSlippageBps',
    trailingStopEnabled: 'trailingStopEnabled',
    trailingStopPercentage: 'trailingStopPercentage',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserTradingConfigScalarFieldEnum = (typeof UserTradingConfigScalarFieldEnum)[keyof typeof UserTradingConfigScalarFieldEnum]


  export const AutoBuyQueueScalarFieldEnum: {
    id: 'id',
    userWalletAddress: 'userWalletAddress',
    callId: 'callId',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    buyAmountSol: 'buyAmountSol',
    maxPrice: 'maxPrice',
    slippageBps: 'slippageBps',
    status: 'status',
    errorMessage: 'errorMessage',
    tradeId: 'tradeId',
    createdAt: 'createdAt',
    processedAt: 'processedAt'
  };

  export type AutoBuyQueueScalarFieldEnum = (typeof AutoBuyQueueScalarFieldEnum)[keyof typeof AutoBuyQueueScalarFieldEnum]


  export const TradeHistoryScalarFieldEnum: {
    id: 'id',
    positionId: 'positionId',
    userWalletAddress: 'userWalletAddress',
    tokenAddress: 'tokenAddress',
    tokenSymbol: 'tokenSymbol',
    tradeType: 'tradeType',
    amountSol: 'amountSol',
    amountTokens: 'amountTokens',
    price: 'price',
    slippageBps: 'slippageBps',
    priceImpactPct: 'priceImpactPct',
    txSignature: 'txSignature',
    txStatus: 'txStatus',
    errorMessage: 'errorMessage',
    jupiterQuote: 'jupiterQuote',
    createdAt: 'createdAt',
    confirmedAt: 'confirmedAt'
  };

  export type TradeHistoryScalarFieldEnum = (typeof TradeHistoryScalarFieldEnum)[keyof typeof TradeHistoryScalarFieldEnum]


  export const PriceAlertScalarFieldEnum: {
    id: 'id',
    positionId: 'positionId',
    userWalletAddress: 'userWalletAddress',
    tokenAddress: 'tokenAddress',
    alertType: 'alertType',
    targetPrice: 'targetPrice',
    isActive: 'isActive',
    triggeredAt: 'triggeredAt',
    createdAt: 'createdAt'
  };

  export type PriceAlertScalarFieldEnum = (typeof PriceAlertScalarFieldEnum)[keyof typeof PriceAlertScalarFieldEnum]


  export const AuditLogScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    eventType: 'eventType',
    entityType: 'entityType',
    entityId: 'entityId',
    userId: 'userId',
    details: 'details',
    ipAddress: 'ipAddress',
    userAgent: 'userAgent'
  };

  export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum]


  export const IngestionRunScalarFieldEnum: {
    runId: 'runId',
    startedAt: 'startedAt',
    endedAt: 'endedAt',
    ok: 'ok',
    tokensProcessed: 'tokensProcessed',
    rowsInserted: 'rowsInserted',
    vendorRateStatus: 'vendorRateStatus',
    errorMessage: 'errorMessage',
    dataType: 'dataType'
  };

  export type IngestionRunScalarFieldEnum = (typeof IngestionRunScalarFieldEnum)[keyof typeof IngestionRunScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type CallWhereInput = {
    AND?: CallWhereInput | CallWhereInput[]
    OR?: CallWhereInput[]
    NOT?: CallWhereInput | CallWhereInput[]
    id?: StringFilter<"Call"> | string
    createdAt?: DateTimeFilter<"Call"> | Date | string
    messageId?: StringFilter<"Call"> | string
    rawMessage?: StringFilter<"Call"> | string
    messageTimestamp?: DateTimeNullableFilter<"Call"> | Date | string | null
    tokenSymbol?: StringNullableFilter<"Call"> | string | null
    tokenName?: StringNullableFilter<"Call"> | string | null
    contractAddress?: StringNullableFilter<"Call"> | string | null
    blockchain?: StringNullableFilter<"Call"> | string | null
    sqdgnLabel?: StringNullableFilter<"Call"> | string | null
    callType?: StringNullableFilter<"Call"> | string | null
    marketCap?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    liquidity?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    volume24h?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    currentMarketCap?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    dexScreenerUrl?: StringNullableFilter<"Call"> | string | null
    jupiterUrl?: StringNullableFilter<"Call"> | string | null
    raydiumUrl?: StringNullableFilter<"Call"> | string | null
    metadata?: JsonNullableFilter<"Call">
    isValid?: BoolFilter<"Call"> | boolean
    parsedAt?: DateTimeFilter<"Call"> | Date | string
    tradingPositions?: TradingPositionListRelationFilter
    autoBuyQueue?: AutoBuyQueueListRelationFilter
  }

  export type CallOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    messageId?: SortOrder
    rawMessage?: SortOrder
    messageTimestamp?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    tokenName?: SortOrderInput | SortOrder
    contractAddress?: SortOrderInput | SortOrder
    blockchain?: SortOrderInput | SortOrder
    sqdgnLabel?: SortOrderInput | SortOrder
    callType?: SortOrderInput | SortOrder
    marketCap?: SortOrderInput | SortOrder
    liquidity?: SortOrderInput | SortOrder
    volume24h?: SortOrderInput | SortOrder
    currentPriceUsd?: SortOrderInput | SortOrder
    priceUpdatedAt?: SortOrderInput | SortOrder
    currentMarketCap?: SortOrderInput | SortOrder
    marketCapUpdatedAt?: SortOrderInput | SortOrder
    dexScreenerUrl?: SortOrderInput | SortOrder
    jupiterUrl?: SortOrderInput | SortOrder
    raydiumUrl?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    isValid?: SortOrder
    parsedAt?: SortOrder
    tradingPositions?: TradingPositionOrderByRelationAggregateInput
    autoBuyQueue?: AutoBuyQueueOrderByRelationAggregateInput
  }

  export type CallWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    messageId?: string
    AND?: CallWhereInput | CallWhereInput[]
    OR?: CallWhereInput[]
    NOT?: CallWhereInput | CallWhereInput[]
    createdAt?: DateTimeFilter<"Call"> | Date | string
    rawMessage?: StringFilter<"Call"> | string
    messageTimestamp?: DateTimeNullableFilter<"Call"> | Date | string | null
    tokenSymbol?: StringNullableFilter<"Call"> | string | null
    tokenName?: StringNullableFilter<"Call"> | string | null
    contractAddress?: StringNullableFilter<"Call"> | string | null
    blockchain?: StringNullableFilter<"Call"> | string | null
    sqdgnLabel?: StringNullableFilter<"Call"> | string | null
    callType?: StringNullableFilter<"Call"> | string | null
    marketCap?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    liquidity?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    volume24h?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    currentMarketCap?: DecimalNullableFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: DateTimeNullableFilter<"Call"> | Date | string | null
    dexScreenerUrl?: StringNullableFilter<"Call"> | string | null
    jupiterUrl?: StringNullableFilter<"Call"> | string | null
    raydiumUrl?: StringNullableFilter<"Call"> | string | null
    metadata?: JsonNullableFilter<"Call">
    isValid?: BoolFilter<"Call"> | boolean
    parsedAt?: DateTimeFilter<"Call"> | Date | string
    tradingPositions?: TradingPositionListRelationFilter
    autoBuyQueue?: AutoBuyQueueListRelationFilter
  }, "id" | "messageId">

  export type CallOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    messageId?: SortOrder
    rawMessage?: SortOrder
    messageTimestamp?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    tokenName?: SortOrderInput | SortOrder
    contractAddress?: SortOrderInput | SortOrder
    blockchain?: SortOrderInput | SortOrder
    sqdgnLabel?: SortOrderInput | SortOrder
    callType?: SortOrderInput | SortOrder
    marketCap?: SortOrderInput | SortOrder
    liquidity?: SortOrderInput | SortOrder
    volume24h?: SortOrderInput | SortOrder
    currentPriceUsd?: SortOrderInput | SortOrder
    priceUpdatedAt?: SortOrderInput | SortOrder
    currentMarketCap?: SortOrderInput | SortOrder
    marketCapUpdatedAt?: SortOrderInput | SortOrder
    dexScreenerUrl?: SortOrderInput | SortOrder
    jupiterUrl?: SortOrderInput | SortOrder
    raydiumUrl?: SortOrderInput | SortOrder
    metadata?: SortOrderInput | SortOrder
    isValid?: SortOrder
    parsedAt?: SortOrder
    _count?: CallCountOrderByAggregateInput
    _avg?: CallAvgOrderByAggregateInput
    _max?: CallMaxOrderByAggregateInput
    _min?: CallMinOrderByAggregateInput
    _sum?: CallSumOrderByAggregateInput
  }

  export type CallScalarWhereWithAggregatesInput = {
    AND?: CallScalarWhereWithAggregatesInput | CallScalarWhereWithAggregatesInput[]
    OR?: CallScalarWhereWithAggregatesInput[]
    NOT?: CallScalarWhereWithAggregatesInput | CallScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Call"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Call"> | Date | string
    messageId?: StringWithAggregatesFilter<"Call"> | string
    rawMessage?: StringWithAggregatesFilter<"Call"> | string
    messageTimestamp?: DateTimeNullableWithAggregatesFilter<"Call"> | Date | string | null
    tokenSymbol?: StringNullableWithAggregatesFilter<"Call"> | string | null
    tokenName?: StringNullableWithAggregatesFilter<"Call"> | string | null
    contractAddress?: StringNullableWithAggregatesFilter<"Call"> | string | null
    blockchain?: StringNullableWithAggregatesFilter<"Call"> | string | null
    sqdgnLabel?: StringNullableWithAggregatesFilter<"Call"> | string | null
    callType?: StringNullableWithAggregatesFilter<"Call"> | string | null
    marketCap?: DecimalNullableWithAggregatesFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    liquidity?: DecimalNullableWithAggregatesFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    volume24h?: DecimalNullableWithAggregatesFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: DecimalNullableWithAggregatesFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: DateTimeNullableWithAggregatesFilter<"Call"> | Date | string | null
    currentMarketCap?: DecimalNullableWithAggregatesFilter<"Call"> | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: DateTimeNullableWithAggregatesFilter<"Call"> | Date | string | null
    dexScreenerUrl?: StringNullableWithAggregatesFilter<"Call"> | string | null
    jupiterUrl?: StringNullableWithAggregatesFilter<"Call"> | string | null
    raydiumUrl?: StringNullableWithAggregatesFilter<"Call"> | string | null
    metadata?: JsonNullableWithAggregatesFilter<"Call">
    isValid?: BoolWithAggregatesFilter<"Call"> | boolean
    parsedAt?: DateTimeWithAggregatesFilter<"Call"> | Date | string
  }

  export type TokenPriceSnapshotWhereInput = {
    AND?: TokenPriceSnapshotWhereInput | TokenPriceSnapshotWhereInput[]
    OR?: TokenPriceSnapshotWhereInput[]
    NOT?: TokenPriceSnapshotWhereInput | TokenPriceSnapshotWhereInput[]
    time?: DateTimeFilter<"TokenPriceSnapshot"> | Date | string
    tokenAddress?: StringFilter<"TokenPriceSnapshot"> | string
    priceUsd?: FloatFilter<"TokenPriceSnapshot"> | number
    priceNative?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    marketCap?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    volume5m?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    volume1h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    volume24h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    liquidityUsd?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    priceChange5m?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    priceChange1h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    priceChange24h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    txnBuys5m?: IntNullableFilter<"TokenPriceSnapshot"> | number | null
    txnSells5m?: IntNullableFilter<"TokenPriceSnapshot"> | number | null
    dexId?: StringNullableFilter<"TokenPriceSnapshot"> | string | null
    pairAddress?: StringNullableFilter<"TokenPriceSnapshot"> | string | null
    source?: StringFilter<"TokenPriceSnapshot"> | string
    createdAt?: DateTimeFilter<"TokenPriceSnapshot"> | Date | string
  }

  export type TokenPriceSnapshotOrderByWithRelationInput = {
    time?: SortOrder
    tokenAddress?: SortOrder
    priceUsd?: SortOrder
    priceNative?: SortOrderInput | SortOrder
    marketCap?: SortOrderInput | SortOrder
    volume5m?: SortOrderInput | SortOrder
    volume1h?: SortOrderInput | SortOrder
    volume24h?: SortOrderInput | SortOrder
    liquidityUsd?: SortOrderInput | SortOrder
    priceChange5m?: SortOrderInput | SortOrder
    priceChange1h?: SortOrderInput | SortOrder
    priceChange24h?: SortOrderInput | SortOrder
    txnBuys5m?: SortOrderInput | SortOrder
    txnSells5m?: SortOrderInput | SortOrder
    dexId?: SortOrderInput | SortOrder
    pairAddress?: SortOrderInput | SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenPriceSnapshotWhereUniqueInput = Prisma.AtLeast<{
    time_tokenAddress?: TokenPriceSnapshotTimeTokenAddressCompoundUniqueInput
    AND?: TokenPriceSnapshotWhereInput | TokenPriceSnapshotWhereInput[]
    OR?: TokenPriceSnapshotWhereInput[]
    NOT?: TokenPriceSnapshotWhereInput | TokenPriceSnapshotWhereInput[]
    time?: DateTimeFilter<"TokenPriceSnapshot"> | Date | string
    tokenAddress?: StringFilter<"TokenPriceSnapshot"> | string
    priceUsd?: FloatFilter<"TokenPriceSnapshot"> | number
    priceNative?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    marketCap?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    volume5m?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    volume1h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    volume24h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    liquidityUsd?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    priceChange5m?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    priceChange1h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    priceChange24h?: FloatNullableFilter<"TokenPriceSnapshot"> | number | null
    txnBuys5m?: IntNullableFilter<"TokenPriceSnapshot"> | number | null
    txnSells5m?: IntNullableFilter<"TokenPriceSnapshot"> | number | null
    dexId?: StringNullableFilter<"TokenPriceSnapshot"> | string | null
    pairAddress?: StringNullableFilter<"TokenPriceSnapshot"> | string | null
    source?: StringFilter<"TokenPriceSnapshot"> | string
    createdAt?: DateTimeFilter<"TokenPriceSnapshot"> | Date | string
  }, "time_tokenAddress">

  export type TokenPriceSnapshotOrderByWithAggregationInput = {
    time?: SortOrder
    tokenAddress?: SortOrder
    priceUsd?: SortOrder
    priceNative?: SortOrderInput | SortOrder
    marketCap?: SortOrderInput | SortOrder
    volume5m?: SortOrderInput | SortOrder
    volume1h?: SortOrderInput | SortOrder
    volume24h?: SortOrderInput | SortOrder
    liquidityUsd?: SortOrderInput | SortOrder
    priceChange5m?: SortOrderInput | SortOrder
    priceChange1h?: SortOrderInput | SortOrder
    priceChange24h?: SortOrderInput | SortOrder
    txnBuys5m?: SortOrderInput | SortOrder
    txnSells5m?: SortOrderInput | SortOrder
    dexId?: SortOrderInput | SortOrder
    pairAddress?: SortOrderInput | SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    _count?: TokenPriceSnapshotCountOrderByAggregateInput
    _avg?: TokenPriceSnapshotAvgOrderByAggregateInput
    _max?: TokenPriceSnapshotMaxOrderByAggregateInput
    _min?: TokenPriceSnapshotMinOrderByAggregateInput
    _sum?: TokenPriceSnapshotSumOrderByAggregateInput
  }

  export type TokenPriceSnapshotScalarWhereWithAggregatesInput = {
    AND?: TokenPriceSnapshotScalarWhereWithAggregatesInput | TokenPriceSnapshotScalarWhereWithAggregatesInput[]
    OR?: TokenPriceSnapshotScalarWhereWithAggregatesInput[]
    NOT?: TokenPriceSnapshotScalarWhereWithAggregatesInput | TokenPriceSnapshotScalarWhereWithAggregatesInput[]
    time?: DateTimeWithAggregatesFilter<"TokenPriceSnapshot"> | Date | string
    tokenAddress?: StringWithAggregatesFilter<"TokenPriceSnapshot"> | string
    priceUsd?: FloatWithAggregatesFilter<"TokenPriceSnapshot"> | number
    priceNative?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    marketCap?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    volume5m?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    volume1h?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    volume24h?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    liquidityUsd?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    priceChange5m?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    priceChange1h?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    priceChange24h?: FloatNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    txnBuys5m?: IntNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    txnSells5m?: IntNullableWithAggregatesFilter<"TokenPriceSnapshot"> | number | null
    dexId?: StringNullableWithAggregatesFilter<"TokenPriceSnapshot"> | string | null
    pairAddress?: StringNullableWithAggregatesFilter<"TokenPriceSnapshot"> | string | null
    source?: StringWithAggregatesFilter<"TokenPriceSnapshot"> | string
    createdAt?: DateTimeWithAggregatesFilter<"TokenPriceSnapshot"> | Date | string
  }

  export type TradingPositionWhereInput = {
    AND?: TradingPositionWhereInput | TradingPositionWhereInput[]
    OR?: TradingPositionWhereInput[]
    NOT?: TradingPositionWhereInput | TradingPositionWhereInput[]
    id?: StringFilter<"TradingPosition"> | string
    userWalletAddress?: StringFilter<"TradingPosition"> | string
    tokenAddress?: StringFilter<"TradingPosition"> | string
    tokenSymbol?: StringNullableFilter<"TradingPosition"> | string | null
    entryPrice?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryTxSignature?: StringNullableFilter<"TradingPosition"> | string | null
    currentPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    highestPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    stopLossPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitReason?: StringNullableFilter<"TradingPosition"> | string | null
    exitTxSignature?: StringNullableFilter<"TradingPosition"> | string | null
    status?: StringFilter<"TradingPosition"> | string
    openedAt?: DateTimeFilter<"TradingPosition"> | Date | string
    closedAt?: DateTimeNullableFilter<"TradingPosition"> | Date | string | null
    lastUpdated?: DateTimeFilter<"TradingPosition"> | Date | string
    callId?: StringNullableFilter<"TradingPosition"> | string | null
    call?: XOR<CallNullableScalarRelationFilter, CallWhereInput> | null
    trailingStops?: TrailingStopListRelationFilter
    tradeHistory?: TradeHistoryListRelationFilter
    priceAlerts?: PriceAlertListRelationFilter
  }

  export type TradingPositionOrderByWithRelationInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    entryTxSignature?: SortOrderInput | SortOrder
    currentPrice?: SortOrderInput | SortOrder
    currentValueSol?: SortOrderInput | SortOrder
    highestPrice?: SortOrderInput | SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrderInput | SortOrder
    takeProfitPrice?: SortOrderInput | SortOrder
    trailingStopPercentage?: SortOrderInput | SortOrder
    exitPrice?: SortOrderInput | SortOrder
    exitAmountSol?: SortOrderInput | SortOrder
    exitReason?: SortOrderInput | SortOrder
    exitTxSignature?: SortOrderInput | SortOrder
    status?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    callId?: SortOrderInput | SortOrder
    call?: CallOrderByWithRelationInput
    trailingStops?: TrailingStopOrderByRelationAggregateInput
    tradeHistory?: TradeHistoryOrderByRelationAggregateInput
    priceAlerts?: PriceAlertOrderByRelationAggregateInput
  }

  export type TradingPositionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TradingPositionWhereInput | TradingPositionWhereInput[]
    OR?: TradingPositionWhereInput[]
    NOT?: TradingPositionWhereInput | TradingPositionWhereInput[]
    userWalletAddress?: StringFilter<"TradingPosition"> | string
    tokenAddress?: StringFilter<"TradingPosition"> | string
    tokenSymbol?: StringNullableFilter<"TradingPosition"> | string | null
    entryPrice?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryTxSignature?: StringNullableFilter<"TradingPosition"> | string | null
    currentPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    highestPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    stopLossPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitReason?: StringNullableFilter<"TradingPosition"> | string | null
    exitTxSignature?: StringNullableFilter<"TradingPosition"> | string | null
    status?: StringFilter<"TradingPosition"> | string
    openedAt?: DateTimeFilter<"TradingPosition"> | Date | string
    closedAt?: DateTimeNullableFilter<"TradingPosition"> | Date | string | null
    lastUpdated?: DateTimeFilter<"TradingPosition"> | Date | string
    callId?: StringNullableFilter<"TradingPosition"> | string | null
    call?: XOR<CallNullableScalarRelationFilter, CallWhereInput> | null
    trailingStops?: TrailingStopListRelationFilter
    tradeHistory?: TradeHistoryListRelationFilter
    priceAlerts?: PriceAlertListRelationFilter
  }, "id">

  export type TradingPositionOrderByWithAggregationInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    entryTxSignature?: SortOrderInput | SortOrder
    currentPrice?: SortOrderInput | SortOrder
    currentValueSol?: SortOrderInput | SortOrder
    highestPrice?: SortOrderInput | SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrderInput | SortOrder
    takeProfitPrice?: SortOrderInput | SortOrder
    trailingStopPercentage?: SortOrderInput | SortOrder
    exitPrice?: SortOrderInput | SortOrder
    exitAmountSol?: SortOrderInput | SortOrder
    exitReason?: SortOrderInput | SortOrder
    exitTxSignature?: SortOrderInput | SortOrder
    status?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrderInput | SortOrder
    lastUpdated?: SortOrder
    callId?: SortOrderInput | SortOrder
    _count?: TradingPositionCountOrderByAggregateInput
    _avg?: TradingPositionAvgOrderByAggregateInput
    _max?: TradingPositionMaxOrderByAggregateInput
    _min?: TradingPositionMinOrderByAggregateInput
    _sum?: TradingPositionSumOrderByAggregateInput
  }

  export type TradingPositionScalarWhereWithAggregatesInput = {
    AND?: TradingPositionScalarWhereWithAggregatesInput | TradingPositionScalarWhereWithAggregatesInput[]
    OR?: TradingPositionScalarWhereWithAggregatesInput[]
    NOT?: TradingPositionScalarWhereWithAggregatesInput | TradingPositionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradingPosition"> | string
    userWalletAddress?: StringWithAggregatesFilter<"TradingPosition"> | string
    tokenAddress?: StringWithAggregatesFilter<"TradingPosition"> | string
    tokenSymbol?: StringNullableWithAggregatesFilter<"TradingPosition"> | string | null
    entryPrice?: DecimalWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryTxSignature?: StringNullableWithAggregatesFilter<"TradingPosition"> | string | null
    currentPrice?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    highestPrice?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    stopLossPrice?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitPrice?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: DecimalNullableWithAggregatesFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitReason?: StringNullableWithAggregatesFilter<"TradingPosition"> | string | null
    exitTxSignature?: StringNullableWithAggregatesFilter<"TradingPosition"> | string | null
    status?: StringWithAggregatesFilter<"TradingPosition"> | string
    openedAt?: DateTimeWithAggregatesFilter<"TradingPosition"> | Date | string
    closedAt?: DateTimeNullableWithAggregatesFilter<"TradingPosition"> | Date | string | null
    lastUpdated?: DateTimeWithAggregatesFilter<"TradingPosition"> | Date | string
    callId?: StringNullableWithAggregatesFilter<"TradingPosition"> | string | null
  }

  export type TrailingStopWhereInput = {
    AND?: TrailingStopWhereInput | TrailingStopWhereInput[]
    OR?: TrailingStopWhereInput[]
    NOT?: TrailingStopWhereInput | TrailingStopWhereInput[]
    id?: StringFilter<"TrailingStop"> | string
    positionId?: StringNullableFilter<"TrailingStop"> | string | null
    highestPrice?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"TrailingStop"> | boolean
    lastCheckedAt?: DateTimeFilter<"TrailingStop"> | Date | string
    triggeredAt?: DateTimeNullableFilter<"TrailingStop"> | Date | string | null
    createdAt?: DateTimeFilter<"TrailingStop"> | Date | string
    updatedAt?: DateTimeFilter<"TrailingStop"> | Date | string
    position?: XOR<TradingPositionNullableScalarRelationFilter, TradingPositionWhereInput> | null
  }

  export type TrailingStopOrderByWithRelationInput = {
    id?: SortOrder
    positionId?: SortOrderInput | SortOrder
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
    isActive?: SortOrder
    lastCheckedAt?: SortOrder
    triggeredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    position?: TradingPositionOrderByWithRelationInput
  }

  export type TrailingStopWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    positionId?: string
    AND?: TrailingStopWhereInput | TrailingStopWhereInput[]
    OR?: TrailingStopWhereInput[]
    NOT?: TrailingStopWhereInput | TrailingStopWhereInput[]
    highestPrice?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"TrailingStop"> | boolean
    lastCheckedAt?: DateTimeFilter<"TrailingStop"> | Date | string
    triggeredAt?: DateTimeNullableFilter<"TrailingStop"> | Date | string | null
    createdAt?: DateTimeFilter<"TrailingStop"> | Date | string
    updatedAt?: DateTimeFilter<"TrailingStop"> | Date | string
    position?: XOR<TradingPositionNullableScalarRelationFilter, TradingPositionWhereInput> | null
  }, "id" | "positionId">

  export type TrailingStopOrderByWithAggregationInput = {
    id?: SortOrder
    positionId?: SortOrderInput | SortOrder
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
    isActive?: SortOrder
    lastCheckedAt?: SortOrder
    triggeredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TrailingStopCountOrderByAggregateInput
    _avg?: TrailingStopAvgOrderByAggregateInput
    _max?: TrailingStopMaxOrderByAggregateInput
    _min?: TrailingStopMinOrderByAggregateInput
    _sum?: TrailingStopSumOrderByAggregateInput
  }

  export type TrailingStopScalarWhereWithAggregatesInput = {
    AND?: TrailingStopScalarWhereWithAggregatesInput | TrailingStopScalarWhereWithAggregatesInput[]
    OR?: TrailingStopScalarWhereWithAggregatesInput[]
    NOT?: TrailingStopScalarWhereWithAggregatesInput | TrailingStopScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TrailingStop"> | string
    positionId?: StringNullableWithAggregatesFilter<"TrailingStop"> | string | null
    highestPrice?: DecimalWithAggregatesFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalWithAggregatesFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalWithAggregatesFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolWithAggregatesFilter<"TrailingStop"> | boolean
    lastCheckedAt?: DateTimeWithAggregatesFilter<"TrailingStop"> | Date | string
    triggeredAt?: DateTimeNullableWithAggregatesFilter<"TrailingStop"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TrailingStop"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"TrailingStop"> | Date | string
  }

  export type UserTradingConfigWhereInput = {
    AND?: UserTradingConfigWhereInput | UserTradingConfigWhereInput[]
    OR?: UserTradingConfigWhereInput[]
    NOT?: UserTradingConfigWhereInput | UserTradingConfigWhereInput[]
    id?: StringFilter<"UserTradingConfig"> | string
    userWalletAddress?: StringFilter<"UserTradingConfig"> | string
    telegramUserId?: StringNullableFilter<"UserTradingConfig"> | string | null
    isAutoBuyEnabled?: BoolFilter<"UserTradingConfig"> | boolean
    defaultBuyAmountSol?: DecimalFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntFilter<"UserTradingConfig"> | number
    maxSlippageBps?: IntFilter<"UserTradingConfig"> | number
    trailingStopEnabled?: BoolFilter<"UserTradingConfig"> | boolean
    trailingStopPercentage?: DecimalFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"UserTradingConfig"> | Date | string
    updatedAt?: DateTimeFilter<"UserTradingConfig"> | Date | string
  }

  export type UserTradingConfigOrderByWithRelationInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    telegramUserId?: SortOrderInput | SortOrder
    isAutoBuyEnabled?: SortOrder
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopEnabled?: SortOrder
    trailingStopPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTradingConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userWalletAddress?: string
    AND?: UserTradingConfigWhereInput | UserTradingConfigWhereInput[]
    OR?: UserTradingConfigWhereInput[]
    NOT?: UserTradingConfigWhereInput | UserTradingConfigWhereInput[]
    telegramUserId?: StringNullableFilter<"UserTradingConfig"> | string | null
    isAutoBuyEnabled?: BoolFilter<"UserTradingConfig"> | boolean
    defaultBuyAmountSol?: DecimalFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntFilter<"UserTradingConfig"> | number
    maxSlippageBps?: IntFilter<"UserTradingConfig"> | number
    trailingStopEnabled?: BoolFilter<"UserTradingConfig"> | boolean
    trailingStopPercentage?: DecimalFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFilter<"UserTradingConfig"> | Date | string
    updatedAt?: DateTimeFilter<"UserTradingConfig"> | Date | string
  }, "id" | "userWalletAddress">

  export type UserTradingConfigOrderByWithAggregationInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    telegramUserId?: SortOrderInput | SortOrder
    isAutoBuyEnabled?: SortOrder
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopEnabled?: SortOrder
    trailingStopPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserTradingConfigCountOrderByAggregateInput
    _avg?: UserTradingConfigAvgOrderByAggregateInput
    _max?: UserTradingConfigMaxOrderByAggregateInput
    _min?: UserTradingConfigMinOrderByAggregateInput
    _sum?: UserTradingConfigSumOrderByAggregateInput
  }

  export type UserTradingConfigScalarWhereWithAggregatesInput = {
    AND?: UserTradingConfigScalarWhereWithAggregatesInput | UserTradingConfigScalarWhereWithAggregatesInput[]
    OR?: UserTradingConfigScalarWhereWithAggregatesInput[]
    NOT?: UserTradingConfigScalarWhereWithAggregatesInput | UserTradingConfigScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserTradingConfig"> | string
    userWalletAddress?: StringWithAggregatesFilter<"UserTradingConfig"> | string
    telegramUserId?: StringNullableWithAggregatesFilter<"UserTradingConfig"> | string | null
    isAutoBuyEnabled?: BoolWithAggregatesFilter<"UserTradingConfig"> | boolean
    defaultBuyAmountSol?: DecimalWithAggregatesFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalWithAggregatesFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntWithAggregatesFilter<"UserTradingConfig"> | number
    maxSlippageBps?: IntWithAggregatesFilter<"UserTradingConfig"> | number
    trailingStopEnabled?: BoolWithAggregatesFilter<"UserTradingConfig"> | boolean
    trailingStopPercentage?: DecimalWithAggregatesFilter<"UserTradingConfig"> | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeWithAggregatesFilter<"UserTradingConfig"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserTradingConfig"> | Date | string
  }

  export type AutoBuyQueueWhereInput = {
    AND?: AutoBuyQueueWhereInput | AutoBuyQueueWhereInput[]
    OR?: AutoBuyQueueWhereInput[]
    NOT?: AutoBuyQueueWhereInput | AutoBuyQueueWhereInput[]
    id?: StringFilter<"AutoBuyQueue"> | string
    userWalletAddress?: StringFilter<"AutoBuyQueue"> | string
    callId?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tokenAddress?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tokenSymbol?: StringFilter<"AutoBuyQueue"> | string
    buyAmountSol?: DecimalFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string
    maxPrice?: DecimalNullableFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string | null
    slippageBps?: IntNullableFilter<"AutoBuyQueue"> | number | null
    status?: StringFilter<"AutoBuyQueue"> | string
    errorMessage?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tradeId?: StringNullableFilter<"AutoBuyQueue"> | string | null
    createdAt?: DateTimeFilter<"AutoBuyQueue"> | Date | string
    processedAt?: DateTimeNullableFilter<"AutoBuyQueue"> | Date | string | null
    call?: XOR<CallNullableScalarRelationFilter, CallWhereInput> | null
    trade?: XOR<TradeHistoryNullableScalarRelationFilter, TradeHistoryWhereInput> | null
  }

  export type AutoBuyQueueOrderByWithRelationInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    callId?: SortOrderInput | SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrder
    buyAmountSol?: SortOrder
    maxPrice?: SortOrderInput | SortOrder
    slippageBps?: SortOrderInput | SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    tradeId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    call?: CallOrderByWithRelationInput
    trade?: TradeHistoryOrderByWithRelationInput
  }

  export type AutoBuyQueueWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AutoBuyQueueWhereInput | AutoBuyQueueWhereInput[]
    OR?: AutoBuyQueueWhereInput[]
    NOT?: AutoBuyQueueWhereInput | AutoBuyQueueWhereInput[]
    userWalletAddress?: StringFilter<"AutoBuyQueue"> | string
    callId?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tokenAddress?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tokenSymbol?: StringFilter<"AutoBuyQueue"> | string
    buyAmountSol?: DecimalFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string
    maxPrice?: DecimalNullableFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string | null
    slippageBps?: IntNullableFilter<"AutoBuyQueue"> | number | null
    status?: StringFilter<"AutoBuyQueue"> | string
    errorMessage?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tradeId?: StringNullableFilter<"AutoBuyQueue"> | string | null
    createdAt?: DateTimeFilter<"AutoBuyQueue"> | Date | string
    processedAt?: DateTimeNullableFilter<"AutoBuyQueue"> | Date | string | null
    call?: XOR<CallNullableScalarRelationFilter, CallWhereInput> | null
    trade?: XOR<TradeHistoryNullableScalarRelationFilter, TradeHistoryWhereInput> | null
  }, "id">

  export type AutoBuyQueueOrderByWithAggregationInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    callId?: SortOrderInput | SortOrder
    tokenAddress?: SortOrderInput | SortOrder
    tokenSymbol?: SortOrder
    buyAmountSol?: SortOrder
    maxPrice?: SortOrderInput | SortOrder
    slippageBps?: SortOrderInput | SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    tradeId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrderInput | SortOrder
    _count?: AutoBuyQueueCountOrderByAggregateInput
    _avg?: AutoBuyQueueAvgOrderByAggregateInput
    _max?: AutoBuyQueueMaxOrderByAggregateInput
    _min?: AutoBuyQueueMinOrderByAggregateInput
    _sum?: AutoBuyQueueSumOrderByAggregateInput
  }

  export type AutoBuyQueueScalarWhereWithAggregatesInput = {
    AND?: AutoBuyQueueScalarWhereWithAggregatesInput | AutoBuyQueueScalarWhereWithAggregatesInput[]
    OR?: AutoBuyQueueScalarWhereWithAggregatesInput[]
    NOT?: AutoBuyQueueScalarWhereWithAggregatesInput | AutoBuyQueueScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AutoBuyQueue"> | string
    userWalletAddress?: StringWithAggregatesFilter<"AutoBuyQueue"> | string
    callId?: StringNullableWithAggregatesFilter<"AutoBuyQueue"> | string | null
    tokenAddress?: StringNullableWithAggregatesFilter<"AutoBuyQueue"> | string | null
    tokenSymbol?: StringWithAggregatesFilter<"AutoBuyQueue"> | string
    buyAmountSol?: DecimalWithAggregatesFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string
    maxPrice?: DecimalNullableWithAggregatesFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string | null
    slippageBps?: IntNullableWithAggregatesFilter<"AutoBuyQueue"> | number | null
    status?: StringWithAggregatesFilter<"AutoBuyQueue"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"AutoBuyQueue"> | string | null
    tradeId?: StringNullableWithAggregatesFilter<"AutoBuyQueue"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AutoBuyQueue"> | Date | string
    processedAt?: DateTimeNullableWithAggregatesFilter<"AutoBuyQueue"> | Date | string | null
  }

  export type TradeHistoryWhereInput = {
    AND?: TradeHistoryWhereInput | TradeHistoryWhereInput[]
    OR?: TradeHistoryWhereInput[]
    NOT?: TradeHistoryWhereInput | TradeHistoryWhereInput[]
    id?: StringFilter<"TradeHistory"> | string
    positionId?: StringNullableFilter<"TradeHistory"> | string | null
    userWalletAddress?: StringFilter<"TradeHistory"> | string
    tokenAddress?: StringFilter<"TradeHistory"> | string
    tokenSymbol?: StringNullableFilter<"TradeHistory"> | string | null
    tradeType?: StringFilter<"TradeHistory"> | string
    amountSol?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    price?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    slippageBps?: IntNullableFilter<"TradeHistory"> | number | null
    priceImpactPct?: DecimalNullableFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string | null
    txSignature?: StringNullableFilter<"TradeHistory"> | string | null
    txStatus?: StringFilter<"TradeHistory"> | string
    errorMessage?: StringNullableFilter<"TradeHistory"> | string | null
    jupiterQuote?: JsonNullableFilter<"TradeHistory">
    createdAt?: DateTimeFilter<"TradeHistory"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"TradeHistory"> | Date | string | null
    position?: XOR<TradingPositionNullableScalarRelationFilter, TradingPositionWhereInput> | null
    autoBuyQueue?: AutoBuyQueueListRelationFilter
  }

  export type TradeHistoryOrderByWithRelationInput = {
    id?: SortOrder
    positionId?: SortOrderInput | SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    tradeType?: SortOrder
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrderInput | SortOrder
    priceImpactPct?: SortOrderInput | SortOrder
    txSignature?: SortOrderInput | SortOrder
    txStatus?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    jupiterQuote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    position?: TradingPositionOrderByWithRelationInput
    autoBuyQueue?: AutoBuyQueueOrderByRelationAggregateInput
  }

  export type TradeHistoryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    txSignature?: string
    AND?: TradeHistoryWhereInput | TradeHistoryWhereInput[]
    OR?: TradeHistoryWhereInput[]
    NOT?: TradeHistoryWhereInput | TradeHistoryWhereInput[]
    positionId?: StringNullableFilter<"TradeHistory"> | string | null
    userWalletAddress?: StringFilter<"TradeHistory"> | string
    tokenAddress?: StringFilter<"TradeHistory"> | string
    tokenSymbol?: StringNullableFilter<"TradeHistory"> | string | null
    tradeType?: StringFilter<"TradeHistory"> | string
    amountSol?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    price?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    slippageBps?: IntNullableFilter<"TradeHistory"> | number | null
    priceImpactPct?: DecimalNullableFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string | null
    txStatus?: StringFilter<"TradeHistory"> | string
    errorMessage?: StringNullableFilter<"TradeHistory"> | string | null
    jupiterQuote?: JsonNullableFilter<"TradeHistory">
    createdAt?: DateTimeFilter<"TradeHistory"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"TradeHistory"> | Date | string | null
    position?: XOR<TradingPositionNullableScalarRelationFilter, TradingPositionWhereInput> | null
    autoBuyQueue?: AutoBuyQueueListRelationFilter
  }, "id" | "txSignature">

  export type TradeHistoryOrderByWithAggregationInput = {
    id?: SortOrder
    positionId?: SortOrderInput | SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrderInput | SortOrder
    tradeType?: SortOrder
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrderInput | SortOrder
    priceImpactPct?: SortOrderInput | SortOrder
    txSignature?: SortOrderInput | SortOrder
    txStatus?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    jupiterQuote?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrderInput | SortOrder
    _count?: TradeHistoryCountOrderByAggregateInput
    _avg?: TradeHistoryAvgOrderByAggregateInput
    _max?: TradeHistoryMaxOrderByAggregateInput
    _min?: TradeHistoryMinOrderByAggregateInput
    _sum?: TradeHistorySumOrderByAggregateInput
  }

  export type TradeHistoryScalarWhereWithAggregatesInput = {
    AND?: TradeHistoryScalarWhereWithAggregatesInput | TradeHistoryScalarWhereWithAggregatesInput[]
    OR?: TradeHistoryScalarWhereWithAggregatesInput[]
    NOT?: TradeHistoryScalarWhereWithAggregatesInput | TradeHistoryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TradeHistory"> | string
    positionId?: StringNullableWithAggregatesFilter<"TradeHistory"> | string | null
    userWalletAddress?: StringWithAggregatesFilter<"TradeHistory"> | string
    tokenAddress?: StringWithAggregatesFilter<"TradeHistory"> | string
    tokenSymbol?: StringNullableWithAggregatesFilter<"TradeHistory"> | string | null
    tradeType?: StringWithAggregatesFilter<"TradeHistory"> | string
    amountSol?: DecimalWithAggregatesFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalWithAggregatesFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    price?: DecimalWithAggregatesFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    slippageBps?: IntNullableWithAggregatesFilter<"TradeHistory"> | number | null
    priceImpactPct?: DecimalNullableWithAggregatesFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string | null
    txSignature?: StringNullableWithAggregatesFilter<"TradeHistory"> | string | null
    txStatus?: StringWithAggregatesFilter<"TradeHistory"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"TradeHistory"> | string | null
    jupiterQuote?: JsonNullableWithAggregatesFilter<"TradeHistory">
    createdAt?: DateTimeWithAggregatesFilter<"TradeHistory"> | Date | string
    confirmedAt?: DateTimeNullableWithAggregatesFilter<"TradeHistory"> | Date | string | null
  }

  export type PriceAlertWhereInput = {
    AND?: PriceAlertWhereInput | PriceAlertWhereInput[]
    OR?: PriceAlertWhereInput[]
    NOT?: PriceAlertWhereInput | PriceAlertWhereInput[]
    id?: StringFilter<"PriceAlert"> | string
    positionId?: StringNullableFilter<"PriceAlert"> | string | null
    userWalletAddress?: StringFilter<"PriceAlert"> | string
    tokenAddress?: StringFilter<"PriceAlert"> | string
    alertType?: StringFilter<"PriceAlert"> | string
    targetPrice?: DecimalFilter<"PriceAlert"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"PriceAlert"> | boolean
    triggeredAt?: DateTimeNullableFilter<"PriceAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"PriceAlert"> | Date | string
    position?: XOR<TradingPositionNullableScalarRelationFilter, TradingPositionWhereInput> | null
  }

  export type PriceAlertOrderByWithRelationInput = {
    id?: SortOrder
    positionId?: SortOrderInput | SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    alertType?: SortOrder
    targetPrice?: SortOrder
    isActive?: SortOrder
    triggeredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    position?: TradingPositionOrderByWithRelationInput
  }

  export type PriceAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PriceAlertWhereInput | PriceAlertWhereInput[]
    OR?: PriceAlertWhereInput[]
    NOT?: PriceAlertWhereInput | PriceAlertWhereInput[]
    positionId?: StringNullableFilter<"PriceAlert"> | string | null
    userWalletAddress?: StringFilter<"PriceAlert"> | string
    tokenAddress?: StringFilter<"PriceAlert"> | string
    alertType?: StringFilter<"PriceAlert"> | string
    targetPrice?: DecimalFilter<"PriceAlert"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"PriceAlert"> | boolean
    triggeredAt?: DateTimeNullableFilter<"PriceAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"PriceAlert"> | Date | string
    position?: XOR<TradingPositionNullableScalarRelationFilter, TradingPositionWhereInput> | null
  }, "id">

  export type PriceAlertOrderByWithAggregationInput = {
    id?: SortOrder
    positionId?: SortOrderInput | SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    alertType?: SortOrder
    targetPrice?: SortOrder
    isActive?: SortOrder
    triggeredAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: PriceAlertCountOrderByAggregateInput
    _avg?: PriceAlertAvgOrderByAggregateInput
    _max?: PriceAlertMaxOrderByAggregateInput
    _min?: PriceAlertMinOrderByAggregateInput
    _sum?: PriceAlertSumOrderByAggregateInput
  }

  export type PriceAlertScalarWhereWithAggregatesInput = {
    AND?: PriceAlertScalarWhereWithAggregatesInput | PriceAlertScalarWhereWithAggregatesInput[]
    OR?: PriceAlertScalarWhereWithAggregatesInput[]
    NOT?: PriceAlertScalarWhereWithAggregatesInput | PriceAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PriceAlert"> | string
    positionId?: StringNullableWithAggregatesFilter<"PriceAlert"> | string | null
    userWalletAddress?: StringWithAggregatesFilter<"PriceAlert"> | string
    tokenAddress?: StringWithAggregatesFilter<"PriceAlert"> | string
    alertType?: StringWithAggregatesFilter<"PriceAlert"> | string
    targetPrice?: DecimalWithAggregatesFilter<"PriceAlert"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolWithAggregatesFilter<"PriceAlert"> | boolean
    triggeredAt?: DateTimeNullableWithAggregatesFilter<"PriceAlert"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"PriceAlert"> | Date | string
  }

  export type AuditLogWhereInput = {
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    id?: StringFilter<"AuditLog"> | string
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    eventType?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    details?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
  }

  export type AuditLogOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
  }

  export type AuditLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: AuditLogWhereInput | AuditLogWhereInput[]
    OR?: AuditLogWhereInput[]
    NOT?: AuditLogWhereInput | AuditLogWhereInput[]
    createdAt?: DateTimeFilter<"AuditLog"> | Date | string
    eventType?: StringFilter<"AuditLog"> | string
    entityType?: StringFilter<"AuditLog"> | string
    entityId?: StringNullableFilter<"AuditLog"> | string | null
    userId?: StringNullableFilter<"AuditLog"> | string | null
    details?: JsonNullableFilter<"AuditLog">
    ipAddress?: StringNullableFilter<"AuditLog"> | string | null
    userAgent?: StringNullableFilter<"AuditLog"> | string | null
  }, "id">

  export type AuditLogOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrderInput | SortOrder
    userId?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    userAgent?: SortOrderInput | SortOrder
    _count?: AuditLogCountOrderByAggregateInput
    _max?: AuditLogMaxOrderByAggregateInput
    _min?: AuditLogMinOrderByAggregateInput
  }

  export type AuditLogScalarWhereWithAggregatesInput = {
    AND?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    OR?: AuditLogScalarWhereWithAggregatesInput[]
    NOT?: AuditLogScalarWhereWithAggregatesInput | AuditLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"AuditLog"> | string
    createdAt?: DateTimeWithAggregatesFilter<"AuditLog"> | Date | string
    eventType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityType?: StringWithAggregatesFilter<"AuditLog"> | string
    entityId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userId?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    details?: JsonNullableWithAggregatesFilter<"AuditLog">
    ipAddress?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
    userAgent?: StringNullableWithAggregatesFilter<"AuditLog"> | string | null
  }

  export type IngestionRunWhereInput = {
    AND?: IngestionRunWhereInput | IngestionRunWhereInput[]
    OR?: IngestionRunWhereInput[]
    NOT?: IngestionRunWhereInput | IngestionRunWhereInput[]
    runId?: StringFilter<"IngestionRun"> | string
    startedAt?: DateTimeFilter<"IngestionRun"> | Date | string
    endedAt?: DateTimeNullableFilter<"IngestionRun"> | Date | string | null
    ok?: BoolNullableFilter<"IngestionRun"> | boolean | null
    tokensProcessed?: IntNullableFilter<"IngestionRun"> | number | null
    rowsInserted?: IntNullableFilter<"IngestionRun"> | number | null
    vendorRateStatus?: JsonNullableFilter<"IngestionRun">
    errorMessage?: StringNullableFilter<"IngestionRun"> | string | null
    dataType?: StringFilter<"IngestionRun"> | string
  }

  export type IngestionRunOrderByWithRelationInput = {
    runId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    ok?: SortOrderInput | SortOrder
    tokensProcessed?: SortOrderInput | SortOrder
    rowsInserted?: SortOrderInput | SortOrder
    vendorRateStatus?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    dataType?: SortOrder
  }

  export type IngestionRunWhereUniqueInput = Prisma.AtLeast<{
    runId?: string
    AND?: IngestionRunWhereInput | IngestionRunWhereInput[]
    OR?: IngestionRunWhereInput[]
    NOT?: IngestionRunWhereInput | IngestionRunWhereInput[]
    startedAt?: DateTimeFilter<"IngestionRun"> | Date | string
    endedAt?: DateTimeNullableFilter<"IngestionRun"> | Date | string | null
    ok?: BoolNullableFilter<"IngestionRun"> | boolean | null
    tokensProcessed?: IntNullableFilter<"IngestionRun"> | number | null
    rowsInserted?: IntNullableFilter<"IngestionRun"> | number | null
    vendorRateStatus?: JsonNullableFilter<"IngestionRun">
    errorMessage?: StringNullableFilter<"IngestionRun"> | string | null
    dataType?: StringFilter<"IngestionRun"> | string
  }, "runId">

  export type IngestionRunOrderByWithAggregationInput = {
    runId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrderInput | SortOrder
    ok?: SortOrderInput | SortOrder
    tokensProcessed?: SortOrderInput | SortOrder
    rowsInserted?: SortOrderInput | SortOrder
    vendorRateStatus?: SortOrderInput | SortOrder
    errorMessage?: SortOrderInput | SortOrder
    dataType?: SortOrder
    _count?: IngestionRunCountOrderByAggregateInput
    _avg?: IngestionRunAvgOrderByAggregateInput
    _max?: IngestionRunMaxOrderByAggregateInput
    _min?: IngestionRunMinOrderByAggregateInput
    _sum?: IngestionRunSumOrderByAggregateInput
  }

  export type IngestionRunScalarWhereWithAggregatesInput = {
    AND?: IngestionRunScalarWhereWithAggregatesInput | IngestionRunScalarWhereWithAggregatesInput[]
    OR?: IngestionRunScalarWhereWithAggregatesInput[]
    NOT?: IngestionRunScalarWhereWithAggregatesInput | IngestionRunScalarWhereWithAggregatesInput[]
    runId?: StringWithAggregatesFilter<"IngestionRun"> | string
    startedAt?: DateTimeWithAggregatesFilter<"IngestionRun"> | Date | string
    endedAt?: DateTimeNullableWithAggregatesFilter<"IngestionRun"> | Date | string | null
    ok?: BoolNullableWithAggregatesFilter<"IngestionRun"> | boolean | null
    tokensProcessed?: IntNullableWithAggregatesFilter<"IngestionRun"> | number | null
    rowsInserted?: IntNullableWithAggregatesFilter<"IngestionRun"> | number | null
    vendorRateStatus?: JsonNullableWithAggregatesFilter<"IngestionRun">
    errorMessage?: StringNullableWithAggregatesFilter<"IngestionRun"> | string | null
    dataType?: StringWithAggregatesFilter<"IngestionRun"> | string
  }

  export type CallCreateInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
    tradingPositions?: TradingPositionCreateNestedManyWithoutCallInput
    autoBuyQueue?: AutoBuyQueueCreateNestedManyWithoutCallInput
  }

  export type CallUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
    tradingPositions?: TradingPositionUncheckedCreateNestedManyWithoutCallInput
    autoBuyQueue?: AutoBuyQueueUncheckedCreateNestedManyWithoutCallInput
  }

  export type CallUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradingPositions?: TradingPositionUpdateManyWithoutCallNestedInput
    autoBuyQueue?: AutoBuyQueueUpdateManyWithoutCallNestedInput
  }

  export type CallUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradingPositions?: TradingPositionUncheckedUpdateManyWithoutCallNestedInput
    autoBuyQueue?: AutoBuyQueueUncheckedUpdateManyWithoutCallNestedInput
  }

  export type CallCreateManyInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
  }

  export type CallUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CallUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenPriceSnapshotCreateInput = {
    time: Date | string
    tokenAddress: string
    priceUsd: number
    priceNative?: number | null
    marketCap?: number | null
    volume5m?: number | null
    volume1h?: number | null
    volume24h?: number | null
    liquidityUsd?: number | null
    priceChange5m?: number | null
    priceChange1h?: number | null
    priceChange24h?: number | null
    txnBuys5m?: number | null
    txnSells5m?: number | null
    dexId?: string | null
    pairAddress?: string | null
    source?: string
    createdAt?: Date | string
  }

  export type TokenPriceSnapshotUncheckedCreateInput = {
    time: Date | string
    tokenAddress: string
    priceUsd: number
    priceNative?: number | null
    marketCap?: number | null
    volume5m?: number | null
    volume1h?: number | null
    volume24h?: number | null
    liquidityUsd?: number | null
    priceChange5m?: number | null
    priceChange1h?: number | null
    priceChange24h?: number | null
    txnBuys5m?: number | null
    txnSells5m?: number | null
    dexId?: string | null
    pairAddress?: string | null
    source?: string
    createdAt?: Date | string
  }

  export type TokenPriceSnapshotUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    priceUsd?: FloatFieldUpdateOperationsInput | number
    priceNative?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume5m?: NullableFloatFieldUpdateOperationsInput | number | null
    volume1h?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: NullableFloatFieldUpdateOperationsInput | number | null
    liquidityUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange5m?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange1h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    txnBuys5m?: NullableIntFieldUpdateOperationsInput | number | null
    txnSells5m?: NullableIntFieldUpdateOperationsInput | number | null
    dexId?: NullableStringFieldUpdateOperationsInput | string | null
    pairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenPriceSnapshotUncheckedUpdateInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    priceUsd?: FloatFieldUpdateOperationsInput | number
    priceNative?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume5m?: NullableFloatFieldUpdateOperationsInput | number | null
    volume1h?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: NullableFloatFieldUpdateOperationsInput | number | null
    liquidityUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange5m?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange1h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    txnBuys5m?: NullableIntFieldUpdateOperationsInput | number | null
    txnSells5m?: NullableIntFieldUpdateOperationsInput | number | null
    dexId?: NullableStringFieldUpdateOperationsInput | string | null
    pairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenPriceSnapshotCreateManyInput = {
    time: Date | string
    tokenAddress: string
    priceUsd: number
    priceNative?: number | null
    marketCap?: number | null
    volume5m?: number | null
    volume1h?: number | null
    volume24h?: number | null
    liquidityUsd?: number | null
    priceChange5m?: number | null
    priceChange1h?: number | null
    priceChange24h?: number | null
    txnBuys5m?: number | null
    txnSells5m?: number | null
    dexId?: string | null
    pairAddress?: string | null
    source?: string
    createdAt?: Date | string
  }

  export type TokenPriceSnapshotUpdateManyMutationInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    priceUsd?: FloatFieldUpdateOperationsInput | number
    priceNative?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume5m?: NullableFloatFieldUpdateOperationsInput | number | null
    volume1h?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: NullableFloatFieldUpdateOperationsInput | number | null
    liquidityUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange5m?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange1h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    txnBuys5m?: NullableIntFieldUpdateOperationsInput | number | null
    txnSells5m?: NullableIntFieldUpdateOperationsInput | number | null
    dexId?: NullableStringFieldUpdateOperationsInput | string | null
    pairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TokenPriceSnapshotUncheckedUpdateManyInput = {
    time?: DateTimeFieldUpdateOperationsInput | Date | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    priceUsd?: FloatFieldUpdateOperationsInput | number
    priceNative?: NullableFloatFieldUpdateOperationsInput | number | null
    marketCap?: NullableFloatFieldUpdateOperationsInput | number | null
    volume5m?: NullableFloatFieldUpdateOperationsInput | number | null
    volume1h?: NullableFloatFieldUpdateOperationsInput | number | null
    volume24h?: NullableFloatFieldUpdateOperationsInput | number | null
    liquidityUsd?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange5m?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange1h?: NullableFloatFieldUpdateOperationsInput | number | null
    priceChange24h?: NullableFloatFieldUpdateOperationsInput | number | null
    txnBuys5m?: NullableIntFieldUpdateOperationsInput | number | null
    txnSells5m?: NullableIntFieldUpdateOperationsInput | number | null
    dexId?: NullableStringFieldUpdateOperationsInput | string | null
    pairAddress?: NullableStringFieldUpdateOperationsInput | string | null
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionCreateInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    call?: CallCreateNestedOneWithoutTradingPositionsInput
    trailingStops?: TrailingStopCreateNestedManyWithoutPositionInput
    tradeHistory?: TradeHistoryCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionUncheckedCreateInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    callId?: string | null
    trailingStops?: TrailingStopUncheckedCreateNestedManyWithoutPositionInput
    tradeHistory?: TradeHistoryUncheckedCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertUncheckedCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    call?: CallUpdateOneWithoutTradingPositionsNestedInput
    trailingStops?: TrailingStopUpdateManyWithoutPositionNestedInput
    tradeHistory?: TradeHistoryUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    trailingStops?: TrailingStopUncheckedUpdateManyWithoutPositionNestedInput
    tradeHistory?: TradeHistoryUncheckedUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionCreateManyInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    callId?: string | null
  }

  export type TradingPositionUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradingPositionUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type TrailingStopCreateInput = {
    id?: string
    highestPrice: Decimal | DecimalJsLike | number | string
    currentStopPrice: Decimal | DecimalJsLike | number | string
    trailingPercentage: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    lastCheckedAt?: Date | string
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    position?: TradingPositionCreateNestedOneWithoutTrailingStopsInput
  }

  export type TrailingStopUncheckedCreateInput = {
    id?: string
    positionId?: string | null
    highestPrice: Decimal | DecimalJsLike | number | string
    currentStopPrice: Decimal | DecimalJsLike | number | string
    trailingPercentage: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    lastCheckedAt?: Date | string
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrailingStopUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    position?: TradingPositionUpdateOneWithoutTrailingStopsNestedInput
  }

  export type TrailingStopUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrailingStopCreateManyInput = {
    id?: string
    positionId?: string | null
    highestPrice: Decimal | DecimalJsLike | number | string
    currentStopPrice: Decimal | DecimalJsLike | number | string
    trailingPercentage: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    lastCheckedAt?: Date | string
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrailingStopUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrailingStopUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTradingConfigCreateInput = {
    id?: string
    userWalletAddress: string
    telegramUserId?: string | null
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: number
    maxSlippageBps?: number
    trailingStopEnabled?: boolean
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTradingConfigUncheckedCreateInput = {
    id?: string
    userWalletAddress: string
    telegramUserId?: string | null
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: number
    maxSlippageBps?: number
    trailingStopEnabled?: boolean
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTradingConfigUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isAutoBuyEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultBuyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntFieldUpdateOperationsInput | number
    maxSlippageBps?: IntFieldUpdateOperationsInput | number
    trailingStopEnabled?: BoolFieldUpdateOperationsInput | boolean
    trailingStopPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTradingConfigUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isAutoBuyEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultBuyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntFieldUpdateOperationsInput | number
    maxSlippageBps?: IntFieldUpdateOperationsInput | number
    trailingStopEnabled?: BoolFieldUpdateOperationsInput | boolean
    trailingStopPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTradingConfigCreateManyInput = {
    id?: string
    userWalletAddress: string
    telegramUserId?: string | null
    isAutoBuyEnabled?: boolean
    defaultBuyAmountSol?: Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: number
    maxSlippageBps?: number
    trailingStopEnabled?: boolean
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserTradingConfigUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isAutoBuyEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultBuyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntFieldUpdateOperationsInput | number
    maxSlippageBps?: IntFieldUpdateOperationsInput | number
    trailingStopEnabled?: BoolFieldUpdateOperationsInput | boolean
    trailingStopPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserTradingConfigUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    telegramUserId?: NullableStringFieldUpdateOperationsInput | string | null
    isAutoBuyEnabled?: BoolFieldUpdateOperationsInput | boolean
    defaultBuyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPositionSizeSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    defaultSlippageBps?: IntFieldUpdateOperationsInput | number
    maxSlippageBps?: IntFieldUpdateOperationsInput | number
    trailingStopEnabled?: BoolFieldUpdateOperationsInput | boolean
    trailingStopPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutoBuyQueueCreateInput = {
    id?: string
    userWalletAddress: string
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
    call?: CallCreateNestedOneWithoutAutoBuyQueueInput
    trade?: TradeHistoryCreateNestedOneWithoutAutoBuyQueueInput
  }

  export type AutoBuyQueueUncheckedCreateInput = {
    id?: string
    userWalletAddress: string
    callId?: string | null
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    tradeId?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type AutoBuyQueueUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    call?: CallUpdateOneWithoutAutoBuyQueueNestedInput
    trade?: TradeHistoryUpdateOneWithoutAutoBuyQueueNestedInput
  }

  export type AutoBuyQueueUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AutoBuyQueueCreateManyInput = {
    id?: string
    userWalletAddress: string
    callId?: string | null
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    tradeId?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type AutoBuyQueueUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AutoBuyQueueUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradeHistoryCreateInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
    position?: TradingPositionCreateNestedOneWithoutTradeHistoryInput
    autoBuyQueue?: AutoBuyQueueCreateNestedManyWithoutTradeInput
  }

  export type TradeHistoryUncheckedCreateInput = {
    id?: string
    positionId?: string | null
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
    autoBuyQueue?: AutoBuyQueueUncheckedCreateNestedManyWithoutTradeInput
  }

  export type TradeHistoryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: TradingPositionUpdateOneWithoutTradeHistoryNestedInput
    autoBuyQueue?: AutoBuyQueueUpdateManyWithoutTradeNestedInput
  }

  export type TradeHistoryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoBuyQueue?: AutoBuyQueueUncheckedUpdateManyWithoutTradeNestedInput
  }

  export type TradeHistoryCreateManyInput = {
    id?: string
    positionId?: string | null
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type TradeHistoryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradeHistoryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PriceAlertCreateInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    position?: TradingPositionCreateNestedOneWithoutPriceAlertsInput
  }

  export type PriceAlertUncheckedCreateInput = {
    id?: string
    positionId?: string | null
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    triggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PriceAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    position?: TradingPositionUpdateOneWithoutPriceAlertsNestedInput
  }

  export type PriceAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceAlertCreateManyInput = {
    id?: string
    positionId?: string | null
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    triggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PriceAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AuditLogCreateInput = {
    id?: string
    createdAt?: Date | string
    eventType: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AuditLogUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    eventType: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AuditLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogCreateManyInput = {
    id?: string
    createdAt?: Date | string
    eventType: string
    entityType: string
    entityId?: string | null
    userId?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    userAgent?: string | null
  }

  export type AuditLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type AuditLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    eventType?: StringFieldUpdateOperationsInput | string
    entityType?: StringFieldUpdateOperationsInput | string
    entityId?: NullableStringFieldUpdateOperationsInput | string | null
    userId?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    userAgent?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type IngestionRunCreateInput = {
    runId?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    ok?: boolean | null
    tokensProcessed?: number | null
    rowsInserted?: number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    dataType?: string
  }

  export type IngestionRunUncheckedCreateInput = {
    runId?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    ok?: boolean | null
    tokensProcessed?: number | null
    rowsInserted?: number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    dataType?: string
  }

  export type IngestionRunUpdateInput = {
    runId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ok?: NullableBoolFieldUpdateOperationsInput | boolean | null
    tokensProcessed?: NullableIntFieldUpdateOperationsInput | number | null
    rowsInserted?: NullableIntFieldUpdateOperationsInput | number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: StringFieldUpdateOperationsInput | string
  }

  export type IngestionRunUncheckedUpdateInput = {
    runId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ok?: NullableBoolFieldUpdateOperationsInput | boolean | null
    tokensProcessed?: NullableIntFieldUpdateOperationsInput | number | null
    rowsInserted?: NullableIntFieldUpdateOperationsInput | number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: StringFieldUpdateOperationsInput | string
  }

  export type IngestionRunCreateManyInput = {
    runId?: string
    startedAt?: Date | string
    endedAt?: Date | string | null
    ok?: boolean | null
    tokensProcessed?: number | null
    rowsInserted?: number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: string | null
    dataType?: string
  }

  export type IngestionRunUpdateManyMutationInput = {
    runId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ok?: NullableBoolFieldUpdateOperationsInput | boolean | null
    tokensProcessed?: NullableIntFieldUpdateOperationsInput | number | null
    rowsInserted?: NullableIntFieldUpdateOperationsInput | number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: StringFieldUpdateOperationsInput | string
  }

  export type IngestionRunUncheckedUpdateManyInput = {
    runId?: StringFieldUpdateOperationsInput | string
    startedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    endedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    ok?: NullableBoolFieldUpdateOperationsInput | boolean | null
    tokensProcessed?: NullableIntFieldUpdateOperationsInput | number | null
    rowsInserted?: NullableIntFieldUpdateOperationsInput | number | null
    vendorRateStatus?: NullableJsonNullValueInput | InputJsonValue
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    dataType?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type TradingPositionListRelationFilter = {
    every?: TradingPositionWhereInput
    some?: TradingPositionWhereInput
    none?: TradingPositionWhereInput
  }

  export type AutoBuyQueueListRelationFilter = {
    every?: AutoBuyQueueWhereInput
    some?: AutoBuyQueueWhereInput
    none?: AutoBuyQueueWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TradingPositionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type AutoBuyQueueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CallCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    messageId?: SortOrder
    rawMessage?: SortOrder
    messageTimestamp?: SortOrder
    tokenSymbol?: SortOrder
    tokenName?: SortOrder
    contractAddress?: SortOrder
    blockchain?: SortOrder
    sqdgnLabel?: SortOrder
    callType?: SortOrder
    marketCap?: SortOrder
    liquidity?: SortOrder
    volume24h?: SortOrder
    currentPriceUsd?: SortOrder
    priceUpdatedAt?: SortOrder
    currentMarketCap?: SortOrder
    marketCapUpdatedAt?: SortOrder
    dexScreenerUrl?: SortOrder
    jupiterUrl?: SortOrder
    raydiumUrl?: SortOrder
    metadata?: SortOrder
    isValid?: SortOrder
    parsedAt?: SortOrder
  }

  export type CallAvgOrderByAggregateInput = {
    marketCap?: SortOrder
    liquidity?: SortOrder
    volume24h?: SortOrder
    currentPriceUsd?: SortOrder
    currentMarketCap?: SortOrder
  }

  export type CallMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    messageId?: SortOrder
    rawMessage?: SortOrder
    messageTimestamp?: SortOrder
    tokenSymbol?: SortOrder
    tokenName?: SortOrder
    contractAddress?: SortOrder
    blockchain?: SortOrder
    sqdgnLabel?: SortOrder
    callType?: SortOrder
    marketCap?: SortOrder
    liquidity?: SortOrder
    volume24h?: SortOrder
    currentPriceUsd?: SortOrder
    priceUpdatedAt?: SortOrder
    currentMarketCap?: SortOrder
    marketCapUpdatedAt?: SortOrder
    dexScreenerUrl?: SortOrder
    jupiterUrl?: SortOrder
    raydiumUrl?: SortOrder
    isValid?: SortOrder
    parsedAt?: SortOrder
  }

  export type CallMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    messageId?: SortOrder
    rawMessage?: SortOrder
    messageTimestamp?: SortOrder
    tokenSymbol?: SortOrder
    tokenName?: SortOrder
    contractAddress?: SortOrder
    blockchain?: SortOrder
    sqdgnLabel?: SortOrder
    callType?: SortOrder
    marketCap?: SortOrder
    liquidity?: SortOrder
    volume24h?: SortOrder
    currentPriceUsd?: SortOrder
    priceUpdatedAt?: SortOrder
    currentMarketCap?: SortOrder
    marketCapUpdatedAt?: SortOrder
    dexScreenerUrl?: SortOrder
    jupiterUrl?: SortOrder
    raydiumUrl?: SortOrder
    isValid?: SortOrder
    parsedAt?: SortOrder
  }

  export type CallSumOrderByAggregateInput = {
    marketCap?: SortOrder
    liquidity?: SortOrder
    volume24h?: SortOrder
    currentPriceUsd?: SortOrder
    currentMarketCap?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type TokenPriceSnapshotTimeTokenAddressCompoundUniqueInput = {
    time: Date | string
    tokenAddress: string
  }

  export type TokenPriceSnapshotCountOrderByAggregateInput = {
    time?: SortOrder
    tokenAddress?: SortOrder
    priceUsd?: SortOrder
    priceNative?: SortOrder
    marketCap?: SortOrder
    volume5m?: SortOrder
    volume1h?: SortOrder
    volume24h?: SortOrder
    liquidityUsd?: SortOrder
    priceChange5m?: SortOrder
    priceChange1h?: SortOrder
    priceChange24h?: SortOrder
    txnBuys5m?: SortOrder
    txnSells5m?: SortOrder
    dexId?: SortOrder
    pairAddress?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenPriceSnapshotAvgOrderByAggregateInput = {
    priceUsd?: SortOrder
    priceNative?: SortOrder
    marketCap?: SortOrder
    volume5m?: SortOrder
    volume1h?: SortOrder
    volume24h?: SortOrder
    liquidityUsd?: SortOrder
    priceChange5m?: SortOrder
    priceChange1h?: SortOrder
    priceChange24h?: SortOrder
    txnBuys5m?: SortOrder
    txnSells5m?: SortOrder
  }

  export type TokenPriceSnapshotMaxOrderByAggregateInput = {
    time?: SortOrder
    tokenAddress?: SortOrder
    priceUsd?: SortOrder
    priceNative?: SortOrder
    marketCap?: SortOrder
    volume5m?: SortOrder
    volume1h?: SortOrder
    volume24h?: SortOrder
    liquidityUsd?: SortOrder
    priceChange5m?: SortOrder
    priceChange1h?: SortOrder
    priceChange24h?: SortOrder
    txnBuys5m?: SortOrder
    txnSells5m?: SortOrder
    dexId?: SortOrder
    pairAddress?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenPriceSnapshotMinOrderByAggregateInput = {
    time?: SortOrder
    tokenAddress?: SortOrder
    priceUsd?: SortOrder
    priceNative?: SortOrder
    marketCap?: SortOrder
    volume5m?: SortOrder
    volume1h?: SortOrder
    volume24h?: SortOrder
    liquidityUsd?: SortOrder
    priceChange5m?: SortOrder
    priceChange1h?: SortOrder
    priceChange24h?: SortOrder
    txnBuys5m?: SortOrder
    txnSells5m?: SortOrder
    dexId?: SortOrder
    pairAddress?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type TokenPriceSnapshotSumOrderByAggregateInput = {
    priceUsd?: SortOrder
    priceNative?: SortOrder
    marketCap?: SortOrder
    volume5m?: SortOrder
    volume1h?: SortOrder
    volume24h?: SortOrder
    liquidityUsd?: SortOrder
    priceChange5m?: SortOrder
    priceChange1h?: SortOrder
    priceChange24h?: SortOrder
    txnBuys5m?: SortOrder
    txnSells5m?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type CallNullableScalarRelationFilter = {
    is?: CallWhereInput | null
    isNot?: CallWhereInput | null
  }

  export type TrailingStopListRelationFilter = {
    every?: TrailingStopWhereInput
    some?: TrailingStopWhereInput
    none?: TrailingStopWhereInput
  }

  export type TradeHistoryListRelationFilter = {
    every?: TradeHistoryWhereInput
    some?: TradeHistoryWhereInput
    none?: TradeHistoryWhereInput
  }

  export type PriceAlertListRelationFilter = {
    every?: PriceAlertWhereInput
    some?: PriceAlertWhereInput
    none?: PriceAlertWhereInput
  }

  export type TrailingStopOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradeHistoryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PriceAlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TradingPositionCountOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    entryTxSignature?: SortOrder
    currentPrice?: SortOrder
    currentValueSol?: SortOrder
    highestPrice?: SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    trailingStopPercentage?: SortOrder
    exitPrice?: SortOrder
    exitAmountSol?: SortOrder
    exitReason?: SortOrder
    exitTxSignature?: SortOrder
    status?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrder
    lastUpdated?: SortOrder
    callId?: SortOrder
  }

  export type TradingPositionAvgOrderByAggregateInput = {
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    currentPrice?: SortOrder
    currentValueSol?: SortOrder
    highestPrice?: SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    trailingStopPercentage?: SortOrder
    exitPrice?: SortOrder
    exitAmountSol?: SortOrder
  }

  export type TradingPositionMaxOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    entryTxSignature?: SortOrder
    currentPrice?: SortOrder
    currentValueSol?: SortOrder
    highestPrice?: SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    trailingStopPercentage?: SortOrder
    exitPrice?: SortOrder
    exitAmountSol?: SortOrder
    exitReason?: SortOrder
    exitTxSignature?: SortOrder
    status?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrder
    lastUpdated?: SortOrder
    callId?: SortOrder
  }

  export type TradingPositionMinOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    entryTxSignature?: SortOrder
    currentPrice?: SortOrder
    currentValueSol?: SortOrder
    highestPrice?: SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    trailingStopPercentage?: SortOrder
    exitPrice?: SortOrder
    exitAmountSol?: SortOrder
    exitReason?: SortOrder
    exitTxSignature?: SortOrder
    status?: SortOrder
    openedAt?: SortOrder
    closedAt?: SortOrder
    lastUpdated?: SortOrder
    callId?: SortOrder
  }

  export type TradingPositionSumOrderByAggregateInput = {
    entryPrice?: SortOrder
    entryAmountSol?: SortOrder
    entryAmountTokens?: SortOrder
    currentPrice?: SortOrder
    currentValueSol?: SortOrder
    highestPrice?: SortOrder
    realizedPnlSol?: SortOrder
    unrealizedPnlSol?: SortOrder
    unrealizedPnlPercentage?: SortOrder
    stopLossPrice?: SortOrder
    takeProfitPrice?: SortOrder
    trailingStopPercentage?: SortOrder
    exitPrice?: SortOrder
    exitAmountSol?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type TradingPositionNullableScalarRelationFilter = {
    is?: TradingPositionWhereInput | null
    isNot?: TradingPositionWhereInput | null
  }

  export type TrailingStopCountOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
    isActive?: SortOrder
    lastCheckedAt?: SortOrder
    triggeredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrailingStopAvgOrderByAggregateInput = {
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
  }

  export type TrailingStopMaxOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
    isActive?: SortOrder
    lastCheckedAt?: SortOrder
    triggeredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrailingStopMinOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
    isActive?: SortOrder
    lastCheckedAt?: SortOrder
    triggeredAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TrailingStopSumOrderByAggregateInput = {
    highestPrice?: SortOrder
    currentStopPrice?: SortOrder
    trailingPercentage?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type UserTradingConfigCountOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    telegramUserId?: SortOrder
    isAutoBuyEnabled?: SortOrder
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopEnabled?: SortOrder
    trailingStopPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTradingConfigAvgOrderByAggregateInput = {
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopPercentage?: SortOrder
  }

  export type UserTradingConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    telegramUserId?: SortOrder
    isAutoBuyEnabled?: SortOrder
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopEnabled?: SortOrder
    trailingStopPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTradingConfigMinOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    telegramUserId?: SortOrder
    isAutoBuyEnabled?: SortOrder
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopEnabled?: SortOrder
    trailingStopPercentage?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserTradingConfigSumOrderByAggregateInput = {
    defaultBuyAmountSol?: SortOrder
    maxPositionSizeSol?: SortOrder
    defaultSlippageBps?: SortOrder
    maxSlippageBps?: SortOrder
    trailingStopPercentage?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type TradeHistoryNullableScalarRelationFilter = {
    is?: TradeHistoryWhereInput | null
    isNot?: TradeHistoryWhereInput | null
  }

  export type AutoBuyQueueCountOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    callId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    buyAmountSol?: SortOrder
    maxPrice?: SortOrder
    slippageBps?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    tradeId?: SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrder
  }

  export type AutoBuyQueueAvgOrderByAggregateInput = {
    buyAmountSol?: SortOrder
    maxPrice?: SortOrder
    slippageBps?: SortOrder
  }

  export type AutoBuyQueueMaxOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    callId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    buyAmountSol?: SortOrder
    maxPrice?: SortOrder
    slippageBps?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    tradeId?: SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrder
  }

  export type AutoBuyQueueMinOrderByAggregateInput = {
    id?: SortOrder
    userWalletAddress?: SortOrder
    callId?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    buyAmountSol?: SortOrder
    maxPrice?: SortOrder
    slippageBps?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    tradeId?: SortOrder
    createdAt?: SortOrder
    processedAt?: SortOrder
  }

  export type AutoBuyQueueSumOrderByAggregateInput = {
    buyAmountSol?: SortOrder
    maxPrice?: SortOrder
    slippageBps?: SortOrder
  }

  export type TradeHistoryCountOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    tradeType?: SortOrder
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrder
    priceImpactPct?: SortOrder
    txSignature?: SortOrder
    txStatus?: SortOrder
    errorMessage?: SortOrder
    jupiterQuote?: SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type TradeHistoryAvgOrderByAggregateInput = {
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrder
    priceImpactPct?: SortOrder
  }

  export type TradeHistoryMaxOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    tradeType?: SortOrder
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrder
    priceImpactPct?: SortOrder
    txSignature?: SortOrder
    txStatus?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type TradeHistoryMinOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    tokenSymbol?: SortOrder
    tradeType?: SortOrder
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrder
    priceImpactPct?: SortOrder
    txSignature?: SortOrder
    txStatus?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
    confirmedAt?: SortOrder
  }

  export type TradeHistorySumOrderByAggregateInput = {
    amountSol?: SortOrder
    amountTokens?: SortOrder
    price?: SortOrder
    slippageBps?: SortOrder
    priceImpactPct?: SortOrder
  }

  export type PriceAlertCountOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    alertType?: SortOrder
    targetPrice?: SortOrder
    isActive?: SortOrder
    triggeredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PriceAlertAvgOrderByAggregateInput = {
    targetPrice?: SortOrder
  }

  export type PriceAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    alertType?: SortOrder
    targetPrice?: SortOrder
    isActive?: SortOrder
    triggeredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PriceAlertMinOrderByAggregateInput = {
    id?: SortOrder
    positionId?: SortOrder
    userWalletAddress?: SortOrder
    tokenAddress?: SortOrder
    alertType?: SortOrder
    targetPrice?: SortOrder
    isActive?: SortOrder
    triggeredAt?: SortOrder
    createdAt?: SortOrder
  }

  export type PriceAlertSumOrderByAggregateInput = {
    targetPrice?: SortOrder
  }

  export type AuditLogCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type AuditLogMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type AuditLogMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    eventType?: SortOrder
    entityType?: SortOrder
    entityId?: SortOrder
    userId?: SortOrder
    ipAddress?: SortOrder
    userAgent?: SortOrder
  }

  export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type IngestionRunCountOrderByAggregateInput = {
    runId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    ok?: SortOrder
    tokensProcessed?: SortOrder
    rowsInserted?: SortOrder
    vendorRateStatus?: SortOrder
    errorMessage?: SortOrder
    dataType?: SortOrder
  }

  export type IngestionRunAvgOrderByAggregateInput = {
    tokensProcessed?: SortOrder
    rowsInserted?: SortOrder
  }

  export type IngestionRunMaxOrderByAggregateInput = {
    runId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    ok?: SortOrder
    tokensProcessed?: SortOrder
    rowsInserted?: SortOrder
    errorMessage?: SortOrder
    dataType?: SortOrder
  }

  export type IngestionRunMinOrderByAggregateInput = {
    runId?: SortOrder
    startedAt?: SortOrder
    endedAt?: SortOrder
    ok?: SortOrder
    tokensProcessed?: SortOrder
    rowsInserted?: SortOrder
    errorMessage?: SortOrder
    dataType?: SortOrder
  }

  export type IngestionRunSumOrderByAggregateInput = {
    tokensProcessed?: SortOrder
    rowsInserted?: SortOrder
  }

  export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type TradingPositionCreateNestedManyWithoutCallInput = {
    create?: XOR<TradingPositionCreateWithoutCallInput, TradingPositionUncheckedCreateWithoutCallInput> | TradingPositionCreateWithoutCallInput[] | TradingPositionUncheckedCreateWithoutCallInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutCallInput | TradingPositionCreateOrConnectWithoutCallInput[]
    createMany?: TradingPositionCreateManyCallInputEnvelope
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
  }

  export type AutoBuyQueueCreateNestedManyWithoutCallInput = {
    create?: XOR<AutoBuyQueueCreateWithoutCallInput, AutoBuyQueueUncheckedCreateWithoutCallInput> | AutoBuyQueueCreateWithoutCallInput[] | AutoBuyQueueUncheckedCreateWithoutCallInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutCallInput | AutoBuyQueueCreateOrConnectWithoutCallInput[]
    createMany?: AutoBuyQueueCreateManyCallInputEnvelope
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
  }

  export type TradingPositionUncheckedCreateNestedManyWithoutCallInput = {
    create?: XOR<TradingPositionCreateWithoutCallInput, TradingPositionUncheckedCreateWithoutCallInput> | TradingPositionCreateWithoutCallInput[] | TradingPositionUncheckedCreateWithoutCallInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutCallInput | TradingPositionCreateOrConnectWithoutCallInput[]
    createMany?: TradingPositionCreateManyCallInputEnvelope
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
  }

  export type AutoBuyQueueUncheckedCreateNestedManyWithoutCallInput = {
    create?: XOR<AutoBuyQueueCreateWithoutCallInput, AutoBuyQueueUncheckedCreateWithoutCallInput> | AutoBuyQueueCreateWithoutCallInput[] | AutoBuyQueueUncheckedCreateWithoutCallInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutCallInput | AutoBuyQueueCreateOrConnectWithoutCallInput[]
    createMany?: AutoBuyQueueCreateManyCallInputEnvelope
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type TradingPositionUpdateManyWithoutCallNestedInput = {
    create?: XOR<TradingPositionCreateWithoutCallInput, TradingPositionUncheckedCreateWithoutCallInput> | TradingPositionCreateWithoutCallInput[] | TradingPositionUncheckedCreateWithoutCallInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutCallInput | TradingPositionCreateOrConnectWithoutCallInput[]
    upsert?: TradingPositionUpsertWithWhereUniqueWithoutCallInput | TradingPositionUpsertWithWhereUniqueWithoutCallInput[]
    createMany?: TradingPositionCreateManyCallInputEnvelope
    set?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    disconnect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    delete?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    update?: TradingPositionUpdateWithWhereUniqueWithoutCallInput | TradingPositionUpdateWithWhereUniqueWithoutCallInput[]
    updateMany?: TradingPositionUpdateManyWithWhereWithoutCallInput | TradingPositionUpdateManyWithWhereWithoutCallInput[]
    deleteMany?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
  }

  export type AutoBuyQueueUpdateManyWithoutCallNestedInput = {
    create?: XOR<AutoBuyQueueCreateWithoutCallInput, AutoBuyQueueUncheckedCreateWithoutCallInput> | AutoBuyQueueCreateWithoutCallInput[] | AutoBuyQueueUncheckedCreateWithoutCallInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutCallInput | AutoBuyQueueCreateOrConnectWithoutCallInput[]
    upsert?: AutoBuyQueueUpsertWithWhereUniqueWithoutCallInput | AutoBuyQueueUpsertWithWhereUniqueWithoutCallInput[]
    createMany?: AutoBuyQueueCreateManyCallInputEnvelope
    set?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    disconnect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    delete?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    update?: AutoBuyQueueUpdateWithWhereUniqueWithoutCallInput | AutoBuyQueueUpdateWithWhereUniqueWithoutCallInput[]
    updateMany?: AutoBuyQueueUpdateManyWithWhereWithoutCallInput | AutoBuyQueueUpdateManyWithWhereWithoutCallInput[]
    deleteMany?: AutoBuyQueueScalarWhereInput | AutoBuyQueueScalarWhereInput[]
  }

  export type TradingPositionUncheckedUpdateManyWithoutCallNestedInput = {
    create?: XOR<TradingPositionCreateWithoutCallInput, TradingPositionUncheckedCreateWithoutCallInput> | TradingPositionCreateWithoutCallInput[] | TradingPositionUncheckedCreateWithoutCallInput[]
    connectOrCreate?: TradingPositionCreateOrConnectWithoutCallInput | TradingPositionCreateOrConnectWithoutCallInput[]
    upsert?: TradingPositionUpsertWithWhereUniqueWithoutCallInput | TradingPositionUpsertWithWhereUniqueWithoutCallInput[]
    createMany?: TradingPositionCreateManyCallInputEnvelope
    set?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    disconnect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    delete?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    connect?: TradingPositionWhereUniqueInput | TradingPositionWhereUniqueInput[]
    update?: TradingPositionUpdateWithWhereUniqueWithoutCallInput | TradingPositionUpdateWithWhereUniqueWithoutCallInput[]
    updateMany?: TradingPositionUpdateManyWithWhereWithoutCallInput | TradingPositionUpdateManyWithWhereWithoutCallInput[]
    deleteMany?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
  }

  export type AutoBuyQueueUncheckedUpdateManyWithoutCallNestedInput = {
    create?: XOR<AutoBuyQueueCreateWithoutCallInput, AutoBuyQueueUncheckedCreateWithoutCallInput> | AutoBuyQueueCreateWithoutCallInput[] | AutoBuyQueueUncheckedCreateWithoutCallInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutCallInput | AutoBuyQueueCreateOrConnectWithoutCallInput[]
    upsert?: AutoBuyQueueUpsertWithWhereUniqueWithoutCallInput | AutoBuyQueueUpsertWithWhereUniqueWithoutCallInput[]
    createMany?: AutoBuyQueueCreateManyCallInputEnvelope
    set?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    disconnect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    delete?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    update?: AutoBuyQueueUpdateWithWhereUniqueWithoutCallInput | AutoBuyQueueUpdateWithWhereUniqueWithoutCallInput[]
    updateMany?: AutoBuyQueueUpdateManyWithWhereWithoutCallInput | AutoBuyQueueUpdateManyWithWhereWithoutCallInput[]
    deleteMany?: AutoBuyQueueScalarWhereInput | AutoBuyQueueScalarWhereInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CallCreateNestedOneWithoutTradingPositionsInput = {
    create?: XOR<CallCreateWithoutTradingPositionsInput, CallUncheckedCreateWithoutTradingPositionsInput>
    connectOrCreate?: CallCreateOrConnectWithoutTradingPositionsInput
    connect?: CallWhereUniqueInput
  }

  export type TrailingStopCreateNestedManyWithoutPositionInput = {
    create?: XOR<TrailingStopCreateWithoutPositionInput, TrailingStopUncheckedCreateWithoutPositionInput> | TrailingStopCreateWithoutPositionInput[] | TrailingStopUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TrailingStopCreateOrConnectWithoutPositionInput | TrailingStopCreateOrConnectWithoutPositionInput[]
    createMany?: TrailingStopCreateManyPositionInputEnvelope
    connect?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
  }

  export type TradeHistoryCreateNestedManyWithoutPositionInput = {
    create?: XOR<TradeHistoryCreateWithoutPositionInput, TradeHistoryUncheckedCreateWithoutPositionInput> | TradeHistoryCreateWithoutPositionInput[] | TradeHistoryUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TradeHistoryCreateOrConnectWithoutPositionInput | TradeHistoryCreateOrConnectWithoutPositionInput[]
    createMany?: TradeHistoryCreateManyPositionInputEnvelope
    connect?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
  }

  export type PriceAlertCreateNestedManyWithoutPositionInput = {
    create?: XOR<PriceAlertCreateWithoutPositionInput, PriceAlertUncheckedCreateWithoutPositionInput> | PriceAlertCreateWithoutPositionInput[] | PriceAlertUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: PriceAlertCreateOrConnectWithoutPositionInput | PriceAlertCreateOrConnectWithoutPositionInput[]
    createMany?: PriceAlertCreateManyPositionInputEnvelope
    connect?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
  }

  export type TrailingStopUncheckedCreateNestedManyWithoutPositionInput = {
    create?: XOR<TrailingStopCreateWithoutPositionInput, TrailingStopUncheckedCreateWithoutPositionInput> | TrailingStopCreateWithoutPositionInput[] | TrailingStopUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TrailingStopCreateOrConnectWithoutPositionInput | TrailingStopCreateOrConnectWithoutPositionInput[]
    createMany?: TrailingStopCreateManyPositionInputEnvelope
    connect?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
  }

  export type TradeHistoryUncheckedCreateNestedManyWithoutPositionInput = {
    create?: XOR<TradeHistoryCreateWithoutPositionInput, TradeHistoryUncheckedCreateWithoutPositionInput> | TradeHistoryCreateWithoutPositionInput[] | TradeHistoryUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TradeHistoryCreateOrConnectWithoutPositionInput | TradeHistoryCreateOrConnectWithoutPositionInput[]
    createMany?: TradeHistoryCreateManyPositionInputEnvelope
    connect?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
  }

  export type PriceAlertUncheckedCreateNestedManyWithoutPositionInput = {
    create?: XOR<PriceAlertCreateWithoutPositionInput, PriceAlertUncheckedCreateWithoutPositionInput> | PriceAlertCreateWithoutPositionInput[] | PriceAlertUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: PriceAlertCreateOrConnectWithoutPositionInput | PriceAlertCreateOrConnectWithoutPositionInput[]
    createMany?: PriceAlertCreateManyPositionInputEnvelope
    connect?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type CallUpdateOneWithoutTradingPositionsNestedInput = {
    create?: XOR<CallCreateWithoutTradingPositionsInput, CallUncheckedCreateWithoutTradingPositionsInput>
    connectOrCreate?: CallCreateOrConnectWithoutTradingPositionsInput
    upsert?: CallUpsertWithoutTradingPositionsInput
    disconnect?: CallWhereInput | boolean
    delete?: CallWhereInput | boolean
    connect?: CallWhereUniqueInput
    update?: XOR<XOR<CallUpdateToOneWithWhereWithoutTradingPositionsInput, CallUpdateWithoutTradingPositionsInput>, CallUncheckedUpdateWithoutTradingPositionsInput>
  }

  export type TrailingStopUpdateManyWithoutPositionNestedInput = {
    create?: XOR<TrailingStopCreateWithoutPositionInput, TrailingStopUncheckedCreateWithoutPositionInput> | TrailingStopCreateWithoutPositionInput[] | TrailingStopUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TrailingStopCreateOrConnectWithoutPositionInput | TrailingStopCreateOrConnectWithoutPositionInput[]
    upsert?: TrailingStopUpsertWithWhereUniqueWithoutPositionInput | TrailingStopUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: TrailingStopCreateManyPositionInputEnvelope
    set?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    disconnect?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    delete?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    connect?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    update?: TrailingStopUpdateWithWhereUniqueWithoutPositionInput | TrailingStopUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: TrailingStopUpdateManyWithWhereWithoutPositionInput | TrailingStopUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: TrailingStopScalarWhereInput | TrailingStopScalarWhereInput[]
  }

  export type TradeHistoryUpdateManyWithoutPositionNestedInput = {
    create?: XOR<TradeHistoryCreateWithoutPositionInput, TradeHistoryUncheckedCreateWithoutPositionInput> | TradeHistoryCreateWithoutPositionInput[] | TradeHistoryUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TradeHistoryCreateOrConnectWithoutPositionInput | TradeHistoryCreateOrConnectWithoutPositionInput[]
    upsert?: TradeHistoryUpsertWithWhereUniqueWithoutPositionInput | TradeHistoryUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: TradeHistoryCreateManyPositionInputEnvelope
    set?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    disconnect?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    delete?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    connect?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    update?: TradeHistoryUpdateWithWhereUniqueWithoutPositionInput | TradeHistoryUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: TradeHistoryUpdateManyWithWhereWithoutPositionInput | TradeHistoryUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: TradeHistoryScalarWhereInput | TradeHistoryScalarWhereInput[]
  }

  export type PriceAlertUpdateManyWithoutPositionNestedInput = {
    create?: XOR<PriceAlertCreateWithoutPositionInput, PriceAlertUncheckedCreateWithoutPositionInput> | PriceAlertCreateWithoutPositionInput[] | PriceAlertUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: PriceAlertCreateOrConnectWithoutPositionInput | PriceAlertCreateOrConnectWithoutPositionInput[]
    upsert?: PriceAlertUpsertWithWhereUniqueWithoutPositionInput | PriceAlertUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: PriceAlertCreateManyPositionInputEnvelope
    set?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    disconnect?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    delete?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    connect?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    update?: PriceAlertUpdateWithWhereUniqueWithoutPositionInput | PriceAlertUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: PriceAlertUpdateManyWithWhereWithoutPositionInput | PriceAlertUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: PriceAlertScalarWhereInput | PriceAlertScalarWhereInput[]
  }

  export type TrailingStopUncheckedUpdateManyWithoutPositionNestedInput = {
    create?: XOR<TrailingStopCreateWithoutPositionInput, TrailingStopUncheckedCreateWithoutPositionInput> | TrailingStopCreateWithoutPositionInput[] | TrailingStopUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TrailingStopCreateOrConnectWithoutPositionInput | TrailingStopCreateOrConnectWithoutPositionInput[]
    upsert?: TrailingStopUpsertWithWhereUniqueWithoutPositionInput | TrailingStopUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: TrailingStopCreateManyPositionInputEnvelope
    set?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    disconnect?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    delete?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    connect?: TrailingStopWhereUniqueInput | TrailingStopWhereUniqueInput[]
    update?: TrailingStopUpdateWithWhereUniqueWithoutPositionInput | TrailingStopUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: TrailingStopUpdateManyWithWhereWithoutPositionInput | TrailingStopUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: TrailingStopScalarWhereInput | TrailingStopScalarWhereInput[]
  }

  export type TradeHistoryUncheckedUpdateManyWithoutPositionNestedInput = {
    create?: XOR<TradeHistoryCreateWithoutPositionInput, TradeHistoryUncheckedCreateWithoutPositionInput> | TradeHistoryCreateWithoutPositionInput[] | TradeHistoryUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: TradeHistoryCreateOrConnectWithoutPositionInput | TradeHistoryCreateOrConnectWithoutPositionInput[]
    upsert?: TradeHistoryUpsertWithWhereUniqueWithoutPositionInput | TradeHistoryUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: TradeHistoryCreateManyPositionInputEnvelope
    set?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    disconnect?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    delete?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    connect?: TradeHistoryWhereUniqueInput | TradeHistoryWhereUniqueInput[]
    update?: TradeHistoryUpdateWithWhereUniqueWithoutPositionInput | TradeHistoryUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: TradeHistoryUpdateManyWithWhereWithoutPositionInput | TradeHistoryUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: TradeHistoryScalarWhereInput | TradeHistoryScalarWhereInput[]
  }

  export type PriceAlertUncheckedUpdateManyWithoutPositionNestedInput = {
    create?: XOR<PriceAlertCreateWithoutPositionInput, PriceAlertUncheckedCreateWithoutPositionInput> | PriceAlertCreateWithoutPositionInput[] | PriceAlertUncheckedCreateWithoutPositionInput[]
    connectOrCreate?: PriceAlertCreateOrConnectWithoutPositionInput | PriceAlertCreateOrConnectWithoutPositionInput[]
    upsert?: PriceAlertUpsertWithWhereUniqueWithoutPositionInput | PriceAlertUpsertWithWhereUniqueWithoutPositionInput[]
    createMany?: PriceAlertCreateManyPositionInputEnvelope
    set?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    disconnect?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    delete?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    connect?: PriceAlertWhereUniqueInput | PriceAlertWhereUniqueInput[]
    update?: PriceAlertUpdateWithWhereUniqueWithoutPositionInput | PriceAlertUpdateWithWhereUniqueWithoutPositionInput[]
    updateMany?: PriceAlertUpdateManyWithWhereWithoutPositionInput | PriceAlertUpdateManyWithWhereWithoutPositionInput[]
    deleteMany?: PriceAlertScalarWhereInput | PriceAlertScalarWhereInput[]
  }

  export type TradingPositionCreateNestedOneWithoutTrailingStopsInput = {
    create?: XOR<TradingPositionCreateWithoutTrailingStopsInput, TradingPositionUncheckedCreateWithoutTrailingStopsInput>
    connectOrCreate?: TradingPositionCreateOrConnectWithoutTrailingStopsInput
    connect?: TradingPositionWhereUniqueInput
  }

  export type TradingPositionUpdateOneWithoutTrailingStopsNestedInput = {
    create?: XOR<TradingPositionCreateWithoutTrailingStopsInput, TradingPositionUncheckedCreateWithoutTrailingStopsInput>
    connectOrCreate?: TradingPositionCreateOrConnectWithoutTrailingStopsInput
    upsert?: TradingPositionUpsertWithoutTrailingStopsInput
    disconnect?: TradingPositionWhereInput | boolean
    delete?: TradingPositionWhereInput | boolean
    connect?: TradingPositionWhereUniqueInput
    update?: XOR<XOR<TradingPositionUpdateToOneWithWhereWithoutTrailingStopsInput, TradingPositionUpdateWithoutTrailingStopsInput>, TradingPositionUncheckedUpdateWithoutTrailingStopsInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type CallCreateNestedOneWithoutAutoBuyQueueInput = {
    create?: XOR<CallCreateWithoutAutoBuyQueueInput, CallUncheckedCreateWithoutAutoBuyQueueInput>
    connectOrCreate?: CallCreateOrConnectWithoutAutoBuyQueueInput
    connect?: CallWhereUniqueInput
  }

  export type TradeHistoryCreateNestedOneWithoutAutoBuyQueueInput = {
    create?: XOR<TradeHistoryCreateWithoutAutoBuyQueueInput, TradeHistoryUncheckedCreateWithoutAutoBuyQueueInput>
    connectOrCreate?: TradeHistoryCreateOrConnectWithoutAutoBuyQueueInput
    connect?: TradeHistoryWhereUniqueInput
  }

  export type CallUpdateOneWithoutAutoBuyQueueNestedInput = {
    create?: XOR<CallCreateWithoutAutoBuyQueueInput, CallUncheckedCreateWithoutAutoBuyQueueInput>
    connectOrCreate?: CallCreateOrConnectWithoutAutoBuyQueueInput
    upsert?: CallUpsertWithoutAutoBuyQueueInput
    disconnect?: CallWhereInput | boolean
    delete?: CallWhereInput | boolean
    connect?: CallWhereUniqueInput
    update?: XOR<XOR<CallUpdateToOneWithWhereWithoutAutoBuyQueueInput, CallUpdateWithoutAutoBuyQueueInput>, CallUncheckedUpdateWithoutAutoBuyQueueInput>
  }

  export type TradeHistoryUpdateOneWithoutAutoBuyQueueNestedInput = {
    create?: XOR<TradeHistoryCreateWithoutAutoBuyQueueInput, TradeHistoryUncheckedCreateWithoutAutoBuyQueueInput>
    connectOrCreate?: TradeHistoryCreateOrConnectWithoutAutoBuyQueueInput
    upsert?: TradeHistoryUpsertWithoutAutoBuyQueueInput
    disconnect?: TradeHistoryWhereInput | boolean
    delete?: TradeHistoryWhereInput | boolean
    connect?: TradeHistoryWhereUniqueInput
    update?: XOR<XOR<TradeHistoryUpdateToOneWithWhereWithoutAutoBuyQueueInput, TradeHistoryUpdateWithoutAutoBuyQueueInput>, TradeHistoryUncheckedUpdateWithoutAutoBuyQueueInput>
  }

  export type TradingPositionCreateNestedOneWithoutTradeHistoryInput = {
    create?: XOR<TradingPositionCreateWithoutTradeHistoryInput, TradingPositionUncheckedCreateWithoutTradeHistoryInput>
    connectOrCreate?: TradingPositionCreateOrConnectWithoutTradeHistoryInput
    connect?: TradingPositionWhereUniqueInput
  }

  export type AutoBuyQueueCreateNestedManyWithoutTradeInput = {
    create?: XOR<AutoBuyQueueCreateWithoutTradeInput, AutoBuyQueueUncheckedCreateWithoutTradeInput> | AutoBuyQueueCreateWithoutTradeInput[] | AutoBuyQueueUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutTradeInput | AutoBuyQueueCreateOrConnectWithoutTradeInput[]
    createMany?: AutoBuyQueueCreateManyTradeInputEnvelope
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
  }

  export type AutoBuyQueueUncheckedCreateNestedManyWithoutTradeInput = {
    create?: XOR<AutoBuyQueueCreateWithoutTradeInput, AutoBuyQueueUncheckedCreateWithoutTradeInput> | AutoBuyQueueCreateWithoutTradeInput[] | AutoBuyQueueUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutTradeInput | AutoBuyQueueCreateOrConnectWithoutTradeInput[]
    createMany?: AutoBuyQueueCreateManyTradeInputEnvelope
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
  }

  export type TradingPositionUpdateOneWithoutTradeHistoryNestedInput = {
    create?: XOR<TradingPositionCreateWithoutTradeHistoryInput, TradingPositionUncheckedCreateWithoutTradeHistoryInput>
    connectOrCreate?: TradingPositionCreateOrConnectWithoutTradeHistoryInput
    upsert?: TradingPositionUpsertWithoutTradeHistoryInput
    disconnect?: TradingPositionWhereInput | boolean
    delete?: TradingPositionWhereInput | boolean
    connect?: TradingPositionWhereUniqueInput
    update?: XOR<XOR<TradingPositionUpdateToOneWithWhereWithoutTradeHistoryInput, TradingPositionUpdateWithoutTradeHistoryInput>, TradingPositionUncheckedUpdateWithoutTradeHistoryInput>
  }

  export type AutoBuyQueueUpdateManyWithoutTradeNestedInput = {
    create?: XOR<AutoBuyQueueCreateWithoutTradeInput, AutoBuyQueueUncheckedCreateWithoutTradeInput> | AutoBuyQueueCreateWithoutTradeInput[] | AutoBuyQueueUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutTradeInput | AutoBuyQueueCreateOrConnectWithoutTradeInput[]
    upsert?: AutoBuyQueueUpsertWithWhereUniqueWithoutTradeInput | AutoBuyQueueUpsertWithWhereUniqueWithoutTradeInput[]
    createMany?: AutoBuyQueueCreateManyTradeInputEnvelope
    set?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    disconnect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    delete?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    update?: AutoBuyQueueUpdateWithWhereUniqueWithoutTradeInput | AutoBuyQueueUpdateWithWhereUniqueWithoutTradeInput[]
    updateMany?: AutoBuyQueueUpdateManyWithWhereWithoutTradeInput | AutoBuyQueueUpdateManyWithWhereWithoutTradeInput[]
    deleteMany?: AutoBuyQueueScalarWhereInput | AutoBuyQueueScalarWhereInput[]
  }

  export type AutoBuyQueueUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: XOR<AutoBuyQueueCreateWithoutTradeInput, AutoBuyQueueUncheckedCreateWithoutTradeInput> | AutoBuyQueueCreateWithoutTradeInput[] | AutoBuyQueueUncheckedCreateWithoutTradeInput[]
    connectOrCreate?: AutoBuyQueueCreateOrConnectWithoutTradeInput | AutoBuyQueueCreateOrConnectWithoutTradeInput[]
    upsert?: AutoBuyQueueUpsertWithWhereUniqueWithoutTradeInput | AutoBuyQueueUpsertWithWhereUniqueWithoutTradeInput[]
    createMany?: AutoBuyQueueCreateManyTradeInputEnvelope
    set?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    disconnect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    delete?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    connect?: AutoBuyQueueWhereUniqueInput | AutoBuyQueueWhereUniqueInput[]
    update?: AutoBuyQueueUpdateWithWhereUniqueWithoutTradeInput | AutoBuyQueueUpdateWithWhereUniqueWithoutTradeInput[]
    updateMany?: AutoBuyQueueUpdateManyWithWhereWithoutTradeInput | AutoBuyQueueUpdateManyWithWhereWithoutTradeInput[]
    deleteMany?: AutoBuyQueueScalarWhereInput | AutoBuyQueueScalarWhereInput[]
  }

  export type TradingPositionCreateNestedOneWithoutPriceAlertsInput = {
    create?: XOR<TradingPositionCreateWithoutPriceAlertsInput, TradingPositionUncheckedCreateWithoutPriceAlertsInput>
    connectOrCreate?: TradingPositionCreateOrConnectWithoutPriceAlertsInput
    connect?: TradingPositionWhereUniqueInput
  }

  export type TradingPositionUpdateOneWithoutPriceAlertsNestedInput = {
    create?: XOR<TradingPositionCreateWithoutPriceAlertsInput, TradingPositionUncheckedCreateWithoutPriceAlertsInput>
    connectOrCreate?: TradingPositionCreateOrConnectWithoutPriceAlertsInput
    upsert?: TradingPositionUpsertWithoutPriceAlertsInput
    disconnect?: TradingPositionWhereInput | boolean
    delete?: TradingPositionWhereInput | boolean
    connect?: TradingPositionWhereUniqueInput
    update?: XOR<XOR<TradingPositionUpdateToOneWithWhereWithoutPriceAlertsInput, TradingPositionUpdateWithoutPriceAlertsInput>, TradingPositionUncheckedUpdateWithoutPriceAlertsInput>
  }

  export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableFilter<$PrismaModel> | boolean | null
  }

  export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel> | null
    not?: NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedBoolNullableFilter<$PrismaModel>
    _max?: NestedBoolNullableFilter<$PrismaModel>
  }

  export type TradingPositionCreateWithoutCallInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    trailingStops?: TrailingStopCreateNestedManyWithoutPositionInput
    tradeHistory?: TradeHistoryCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionUncheckedCreateWithoutCallInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    trailingStops?: TrailingStopUncheckedCreateNestedManyWithoutPositionInput
    tradeHistory?: TradeHistoryUncheckedCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertUncheckedCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionCreateOrConnectWithoutCallInput = {
    where: TradingPositionWhereUniqueInput
    create: XOR<TradingPositionCreateWithoutCallInput, TradingPositionUncheckedCreateWithoutCallInput>
  }

  export type TradingPositionCreateManyCallInputEnvelope = {
    data: TradingPositionCreateManyCallInput | TradingPositionCreateManyCallInput[]
    skipDuplicates?: boolean
  }

  export type AutoBuyQueueCreateWithoutCallInput = {
    id?: string
    userWalletAddress: string
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
    trade?: TradeHistoryCreateNestedOneWithoutAutoBuyQueueInput
  }

  export type AutoBuyQueueUncheckedCreateWithoutCallInput = {
    id?: string
    userWalletAddress: string
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    tradeId?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type AutoBuyQueueCreateOrConnectWithoutCallInput = {
    where: AutoBuyQueueWhereUniqueInput
    create: XOR<AutoBuyQueueCreateWithoutCallInput, AutoBuyQueueUncheckedCreateWithoutCallInput>
  }

  export type AutoBuyQueueCreateManyCallInputEnvelope = {
    data: AutoBuyQueueCreateManyCallInput | AutoBuyQueueCreateManyCallInput[]
    skipDuplicates?: boolean
  }

  export type TradingPositionUpsertWithWhereUniqueWithoutCallInput = {
    where: TradingPositionWhereUniqueInput
    update: XOR<TradingPositionUpdateWithoutCallInput, TradingPositionUncheckedUpdateWithoutCallInput>
    create: XOR<TradingPositionCreateWithoutCallInput, TradingPositionUncheckedCreateWithoutCallInput>
  }

  export type TradingPositionUpdateWithWhereUniqueWithoutCallInput = {
    where: TradingPositionWhereUniqueInput
    data: XOR<TradingPositionUpdateWithoutCallInput, TradingPositionUncheckedUpdateWithoutCallInput>
  }

  export type TradingPositionUpdateManyWithWhereWithoutCallInput = {
    where: TradingPositionScalarWhereInput
    data: XOR<TradingPositionUpdateManyMutationInput, TradingPositionUncheckedUpdateManyWithoutCallInput>
  }

  export type TradingPositionScalarWhereInput = {
    AND?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
    OR?: TradingPositionScalarWhereInput[]
    NOT?: TradingPositionScalarWhereInput | TradingPositionScalarWhereInput[]
    id?: StringFilter<"TradingPosition"> | string
    userWalletAddress?: StringFilter<"TradingPosition"> | string
    tokenAddress?: StringFilter<"TradingPosition"> | string
    tokenSymbol?: StringNullableFilter<"TradingPosition"> | string | null
    entryPrice?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    entryTxSignature?: StringNullableFilter<"TradingPosition"> | string | null
    currentPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    highestPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string
    stopLossPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitPrice?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: DecimalNullableFilter<"TradingPosition"> | Decimal | DecimalJsLike | number | string | null
    exitReason?: StringNullableFilter<"TradingPosition"> | string | null
    exitTxSignature?: StringNullableFilter<"TradingPosition"> | string | null
    status?: StringFilter<"TradingPosition"> | string
    openedAt?: DateTimeFilter<"TradingPosition"> | Date | string
    closedAt?: DateTimeNullableFilter<"TradingPosition"> | Date | string | null
    lastUpdated?: DateTimeFilter<"TradingPosition"> | Date | string
    callId?: StringNullableFilter<"TradingPosition"> | string | null
  }

  export type AutoBuyQueueUpsertWithWhereUniqueWithoutCallInput = {
    where: AutoBuyQueueWhereUniqueInput
    update: XOR<AutoBuyQueueUpdateWithoutCallInput, AutoBuyQueueUncheckedUpdateWithoutCallInput>
    create: XOR<AutoBuyQueueCreateWithoutCallInput, AutoBuyQueueUncheckedCreateWithoutCallInput>
  }

  export type AutoBuyQueueUpdateWithWhereUniqueWithoutCallInput = {
    where: AutoBuyQueueWhereUniqueInput
    data: XOR<AutoBuyQueueUpdateWithoutCallInput, AutoBuyQueueUncheckedUpdateWithoutCallInput>
  }

  export type AutoBuyQueueUpdateManyWithWhereWithoutCallInput = {
    where: AutoBuyQueueScalarWhereInput
    data: XOR<AutoBuyQueueUpdateManyMutationInput, AutoBuyQueueUncheckedUpdateManyWithoutCallInput>
  }

  export type AutoBuyQueueScalarWhereInput = {
    AND?: AutoBuyQueueScalarWhereInput | AutoBuyQueueScalarWhereInput[]
    OR?: AutoBuyQueueScalarWhereInput[]
    NOT?: AutoBuyQueueScalarWhereInput | AutoBuyQueueScalarWhereInput[]
    id?: StringFilter<"AutoBuyQueue"> | string
    userWalletAddress?: StringFilter<"AutoBuyQueue"> | string
    callId?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tokenAddress?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tokenSymbol?: StringFilter<"AutoBuyQueue"> | string
    buyAmountSol?: DecimalFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string
    maxPrice?: DecimalNullableFilter<"AutoBuyQueue"> | Decimal | DecimalJsLike | number | string | null
    slippageBps?: IntNullableFilter<"AutoBuyQueue"> | number | null
    status?: StringFilter<"AutoBuyQueue"> | string
    errorMessage?: StringNullableFilter<"AutoBuyQueue"> | string | null
    tradeId?: StringNullableFilter<"AutoBuyQueue"> | string | null
    createdAt?: DateTimeFilter<"AutoBuyQueue"> | Date | string
    processedAt?: DateTimeNullableFilter<"AutoBuyQueue"> | Date | string | null
  }

  export type CallCreateWithoutTradingPositionsInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
    autoBuyQueue?: AutoBuyQueueCreateNestedManyWithoutCallInput
  }

  export type CallUncheckedCreateWithoutTradingPositionsInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
    autoBuyQueue?: AutoBuyQueueUncheckedCreateNestedManyWithoutCallInput
  }

  export type CallCreateOrConnectWithoutTradingPositionsInput = {
    where: CallWhereUniqueInput
    create: XOR<CallCreateWithoutTradingPositionsInput, CallUncheckedCreateWithoutTradingPositionsInput>
  }

  export type TrailingStopCreateWithoutPositionInput = {
    id?: string
    highestPrice: Decimal | DecimalJsLike | number | string
    currentStopPrice: Decimal | DecimalJsLike | number | string
    trailingPercentage: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    lastCheckedAt?: Date | string
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrailingStopUncheckedCreateWithoutPositionInput = {
    id?: string
    highestPrice: Decimal | DecimalJsLike | number | string
    currentStopPrice: Decimal | DecimalJsLike | number | string
    trailingPercentage: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    lastCheckedAt?: Date | string
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TrailingStopCreateOrConnectWithoutPositionInput = {
    where: TrailingStopWhereUniqueInput
    create: XOR<TrailingStopCreateWithoutPositionInput, TrailingStopUncheckedCreateWithoutPositionInput>
  }

  export type TrailingStopCreateManyPositionInputEnvelope = {
    data: TrailingStopCreateManyPositionInput | TrailingStopCreateManyPositionInput[]
    skipDuplicates?: boolean
  }

  export type TradeHistoryCreateWithoutPositionInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
    autoBuyQueue?: AutoBuyQueueCreateNestedManyWithoutTradeInput
  }

  export type TradeHistoryUncheckedCreateWithoutPositionInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
    autoBuyQueue?: AutoBuyQueueUncheckedCreateNestedManyWithoutTradeInput
  }

  export type TradeHistoryCreateOrConnectWithoutPositionInput = {
    where: TradeHistoryWhereUniqueInput
    create: XOR<TradeHistoryCreateWithoutPositionInput, TradeHistoryUncheckedCreateWithoutPositionInput>
  }

  export type TradeHistoryCreateManyPositionInputEnvelope = {
    data: TradeHistoryCreateManyPositionInput | TradeHistoryCreateManyPositionInput[]
    skipDuplicates?: boolean
  }

  export type PriceAlertCreateWithoutPositionInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    triggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PriceAlertUncheckedCreateWithoutPositionInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    triggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type PriceAlertCreateOrConnectWithoutPositionInput = {
    where: PriceAlertWhereUniqueInput
    create: XOR<PriceAlertCreateWithoutPositionInput, PriceAlertUncheckedCreateWithoutPositionInput>
  }

  export type PriceAlertCreateManyPositionInputEnvelope = {
    data: PriceAlertCreateManyPositionInput | PriceAlertCreateManyPositionInput[]
    skipDuplicates?: boolean
  }

  export type CallUpsertWithoutTradingPositionsInput = {
    update: XOR<CallUpdateWithoutTradingPositionsInput, CallUncheckedUpdateWithoutTradingPositionsInput>
    create: XOR<CallCreateWithoutTradingPositionsInput, CallUncheckedCreateWithoutTradingPositionsInput>
    where?: CallWhereInput
  }

  export type CallUpdateToOneWithWhereWithoutTradingPositionsInput = {
    where?: CallWhereInput
    data: XOR<CallUpdateWithoutTradingPositionsInput, CallUncheckedUpdateWithoutTradingPositionsInput>
  }

  export type CallUpdateWithoutTradingPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autoBuyQueue?: AutoBuyQueueUpdateManyWithoutCallNestedInput
  }

  export type CallUncheckedUpdateWithoutTradingPositionsInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    autoBuyQueue?: AutoBuyQueueUncheckedUpdateManyWithoutCallNestedInput
  }

  export type TrailingStopUpsertWithWhereUniqueWithoutPositionInput = {
    where: TrailingStopWhereUniqueInput
    update: XOR<TrailingStopUpdateWithoutPositionInput, TrailingStopUncheckedUpdateWithoutPositionInput>
    create: XOR<TrailingStopCreateWithoutPositionInput, TrailingStopUncheckedCreateWithoutPositionInput>
  }

  export type TrailingStopUpdateWithWhereUniqueWithoutPositionInput = {
    where: TrailingStopWhereUniqueInput
    data: XOR<TrailingStopUpdateWithoutPositionInput, TrailingStopUncheckedUpdateWithoutPositionInput>
  }

  export type TrailingStopUpdateManyWithWhereWithoutPositionInput = {
    where: TrailingStopScalarWhereInput
    data: XOR<TrailingStopUpdateManyMutationInput, TrailingStopUncheckedUpdateManyWithoutPositionInput>
  }

  export type TrailingStopScalarWhereInput = {
    AND?: TrailingStopScalarWhereInput | TrailingStopScalarWhereInput[]
    OR?: TrailingStopScalarWhereInput[]
    NOT?: TrailingStopScalarWhereInput | TrailingStopScalarWhereInput[]
    id?: StringFilter<"TrailingStop"> | string
    positionId?: StringNullableFilter<"TrailingStop"> | string | null
    highestPrice?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFilter<"TrailingStop"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"TrailingStop"> | boolean
    lastCheckedAt?: DateTimeFilter<"TrailingStop"> | Date | string
    triggeredAt?: DateTimeNullableFilter<"TrailingStop"> | Date | string | null
    createdAt?: DateTimeFilter<"TrailingStop"> | Date | string
    updatedAt?: DateTimeFilter<"TrailingStop"> | Date | string
  }

  export type TradeHistoryUpsertWithWhereUniqueWithoutPositionInput = {
    where: TradeHistoryWhereUniqueInput
    update: XOR<TradeHistoryUpdateWithoutPositionInput, TradeHistoryUncheckedUpdateWithoutPositionInput>
    create: XOR<TradeHistoryCreateWithoutPositionInput, TradeHistoryUncheckedCreateWithoutPositionInput>
  }

  export type TradeHistoryUpdateWithWhereUniqueWithoutPositionInput = {
    where: TradeHistoryWhereUniqueInput
    data: XOR<TradeHistoryUpdateWithoutPositionInput, TradeHistoryUncheckedUpdateWithoutPositionInput>
  }

  export type TradeHistoryUpdateManyWithWhereWithoutPositionInput = {
    where: TradeHistoryScalarWhereInput
    data: XOR<TradeHistoryUpdateManyMutationInput, TradeHistoryUncheckedUpdateManyWithoutPositionInput>
  }

  export type TradeHistoryScalarWhereInput = {
    AND?: TradeHistoryScalarWhereInput | TradeHistoryScalarWhereInput[]
    OR?: TradeHistoryScalarWhereInput[]
    NOT?: TradeHistoryScalarWhereInput | TradeHistoryScalarWhereInput[]
    id?: StringFilter<"TradeHistory"> | string
    positionId?: StringNullableFilter<"TradeHistory"> | string | null
    userWalletAddress?: StringFilter<"TradeHistory"> | string
    tokenAddress?: StringFilter<"TradeHistory"> | string
    tokenSymbol?: StringNullableFilter<"TradeHistory"> | string | null
    tradeType?: StringFilter<"TradeHistory"> | string
    amountSol?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    price?: DecimalFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string
    slippageBps?: IntNullableFilter<"TradeHistory"> | number | null
    priceImpactPct?: DecimalNullableFilter<"TradeHistory"> | Decimal | DecimalJsLike | number | string | null
    txSignature?: StringNullableFilter<"TradeHistory"> | string | null
    txStatus?: StringFilter<"TradeHistory"> | string
    errorMessage?: StringNullableFilter<"TradeHistory"> | string | null
    jupiterQuote?: JsonNullableFilter<"TradeHistory">
    createdAt?: DateTimeFilter<"TradeHistory"> | Date | string
    confirmedAt?: DateTimeNullableFilter<"TradeHistory"> | Date | string | null
  }

  export type PriceAlertUpsertWithWhereUniqueWithoutPositionInput = {
    where: PriceAlertWhereUniqueInput
    update: XOR<PriceAlertUpdateWithoutPositionInput, PriceAlertUncheckedUpdateWithoutPositionInput>
    create: XOR<PriceAlertCreateWithoutPositionInput, PriceAlertUncheckedCreateWithoutPositionInput>
  }

  export type PriceAlertUpdateWithWhereUniqueWithoutPositionInput = {
    where: PriceAlertWhereUniqueInput
    data: XOR<PriceAlertUpdateWithoutPositionInput, PriceAlertUncheckedUpdateWithoutPositionInput>
  }

  export type PriceAlertUpdateManyWithWhereWithoutPositionInput = {
    where: PriceAlertScalarWhereInput
    data: XOR<PriceAlertUpdateManyMutationInput, PriceAlertUncheckedUpdateManyWithoutPositionInput>
  }

  export type PriceAlertScalarWhereInput = {
    AND?: PriceAlertScalarWhereInput | PriceAlertScalarWhereInput[]
    OR?: PriceAlertScalarWhereInput[]
    NOT?: PriceAlertScalarWhereInput | PriceAlertScalarWhereInput[]
    id?: StringFilter<"PriceAlert"> | string
    positionId?: StringNullableFilter<"PriceAlert"> | string | null
    userWalletAddress?: StringFilter<"PriceAlert"> | string
    tokenAddress?: StringFilter<"PriceAlert"> | string
    alertType?: StringFilter<"PriceAlert"> | string
    targetPrice?: DecimalFilter<"PriceAlert"> | Decimal | DecimalJsLike | number | string
    isActive?: BoolFilter<"PriceAlert"> | boolean
    triggeredAt?: DateTimeNullableFilter<"PriceAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"PriceAlert"> | Date | string
  }

  export type TradingPositionCreateWithoutTrailingStopsInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    call?: CallCreateNestedOneWithoutTradingPositionsInput
    tradeHistory?: TradeHistoryCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionUncheckedCreateWithoutTrailingStopsInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    callId?: string | null
    tradeHistory?: TradeHistoryUncheckedCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertUncheckedCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionCreateOrConnectWithoutTrailingStopsInput = {
    where: TradingPositionWhereUniqueInput
    create: XOR<TradingPositionCreateWithoutTrailingStopsInput, TradingPositionUncheckedCreateWithoutTrailingStopsInput>
  }

  export type TradingPositionUpsertWithoutTrailingStopsInput = {
    update: XOR<TradingPositionUpdateWithoutTrailingStopsInput, TradingPositionUncheckedUpdateWithoutTrailingStopsInput>
    create: XOR<TradingPositionCreateWithoutTrailingStopsInput, TradingPositionUncheckedCreateWithoutTrailingStopsInput>
    where?: TradingPositionWhereInput
  }

  export type TradingPositionUpdateToOneWithWhereWithoutTrailingStopsInput = {
    where?: TradingPositionWhereInput
    data: XOR<TradingPositionUpdateWithoutTrailingStopsInput, TradingPositionUncheckedUpdateWithoutTrailingStopsInput>
  }

  export type TradingPositionUpdateWithoutTrailingStopsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    call?: CallUpdateOneWithoutTradingPositionsNestedInput
    tradeHistory?: TradeHistoryUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionUncheckedUpdateWithoutTrailingStopsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    tradeHistory?: TradeHistoryUncheckedUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type CallCreateWithoutAutoBuyQueueInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
    tradingPositions?: TradingPositionCreateNestedManyWithoutCallInput
  }

  export type CallUncheckedCreateWithoutAutoBuyQueueInput = {
    id?: string
    createdAt?: Date | string
    messageId: string
    rawMessage: string
    messageTimestamp?: Date | string | null
    tokenSymbol?: string | null
    tokenName?: string | null
    contractAddress?: string | null
    blockchain?: string | null
    sqdgnLabel?: string | null
    callType?: string | null
    marketCap?: Decimal | DecimalJsLike | number | string | null
    liquidity?: Decimal | DecimalJsLike | number | string | null
    volume24h?: Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: Date | string | null
    currentMarketCap?: Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: Date | string | null
    dexScreenerUrl?: string | null
    jupiterUrl?: string | null
    raydiumUrl?: string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: boolean
    parsedAt?: Date | string
    tradingPositions?: TradingPositionUncheckedCreateNestedManyWithoutCallInput
  }

  export type CallCreateOrConnectWithoutAutoBuyQueueInput = {
    where: CallWhereUniqueInput
    create: XOR<CallCreateWithoutAutoBuyQueueInput, CallUncheckedCreateWithoutAutoBuyQueueInput>
  }

  export type TradeHistoryCreateWithoutAutoBuyQueueInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
    position?: TradingPositionCreateNestedOneWithoutTradeHistoryInput
  }

  export type TradeHistoryUncheckedCreateWithoutAutoBuyQueueInput = {
    id?: string
    positionId?: string | null
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type TradeHistoryCreateOrConnectWithoutAutoBuyQueueInput = {
    where: TradeHistoryWhereUniqueInput
    create: XOR<TradeHistoryCreateWithoutAutoBuyQueueInput, TradeHistoryUncheckedCreateWithoutAutoBuyQueueInput>
  }

  export type CallUpsertWithoutAutoBuyQueueInput = {
    update: XOR<CallUpdateWithoutAutoBuyQueueInput, CallUncheckedUpdateWithoutAutoBuyQueueInput>
    create: XOR<CallCreateWithoutAutoBuyQueueInput, CallUncheckedCreateWithoutAutoBuyQueueInput>
    where?: CallWhereInput
  }

  export type CallUpdateToOneWithWhereWithoutAutoBuyQueueInput = {
    where?: CallWhereInput
    data: XOR<CallUpdateWithoutAutoBuyQueueInput, CallUncheckedUpdateWithoutAutoBuyQueueInput>
  }

  export type CallUpdateWithoutAutoBuyQueueInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradingPositions?: TradingPositionUpdateManyWithoutCallNestedInput
  }

  export type CallUncheckedUpdateWithoutAutoBuyQueueInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messageId?: StringFieldUpdateOperationsInput | string
    rawMessage?: StringFieldUpdateOperationsInput | string
    messageTimestamp?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tokenName?: NullableStringFieldUpdateOperationsInput | string | null
    contractAddress?: NullableStringFieldUpdateOperationsInput | string | null
    blockchain?: NullableStringFieldUpdateOperationsInput | string | null
    sqdgnLabel?: NullableStringFieldUpdateOperationsInput | string | null
    callType?: NullableStringFieldUpdateOperationsInput | string | null
    marketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    liquidity?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    volume24h?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentPriceUsd?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    priceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    currentMarketCap?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    marketCapUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dexScreenerUrl?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterUrl?: NullableStringFieldUpdateOperationsInput | string | null
    raydiumUrl?: NullableStringFieldUpdateOperationsInput | string | null
    metadata?: NullableJsonNullValueInput | InputJsonValue
    isValid?: BoolFieldUpdateOperationsInput | boolean
    parsedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tradingPositions?: TradingPositionUncheckedUpdateManyWithoutCallNestedInput
  }

  export type TradeHistoryUpsertWithoutAutoBuyQueueInput = {
    update: XOR<TradeHistoryUpdateWithoutAutoBuyQueueInput, TradeHistoryUncheckedUpdateWithoutAutoBuyQueueInput>
    create: XOR<TradeHistoryCreateWithoutAutoBuyQueueInput, TradeHistoryUncheckedCreateWithoutAutoBuyQueueInput>
    where?: TradeHistoryWhereInput
  }

  export type TradeHistoryUpdateToOneWithWhereWithoutAutoBuyQueueInput = {
    where?: TradeHistoryWhereInput
    data: XOR<TradeHistoryUpdateWithoutAutoBuyQueueInput, TradeHistoryUncheckedUpdateWithoutAutoBuyQueueInput>
  }

  export type TradeHistoryUpdateWithoutAutoBuyQueueInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    position?: TradingPositionUpdateOneWithoutTradeHistoryNestedInput
  }

  export type TradeHistoryUncheckedUpdateWithoutAutoBuyQueueInput = {
    id?: StringFieldUpdateOperationsInput | string
    positionId?: NullableStringFieldUpdateOperationsInput | string | null
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TradingPositionCreateWithoutTradeHistoryInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    call?: CallCreateNestedOneWithoutTradingPositionsInput
    trailingStops?: TrailingStopCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionUncheckedCreateWithoutTradeHistoryInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    callId?: string | null
    trailingStops?: TrailingStopUncheckedCreateNestedManyWithoutPositionInput
    priceAlerts?: PriceAlertUncheckedCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionCreateOrConnectWithoutTradeHistoryInput = {
    where: TradingPositionWhereUniqueInput
    create: XOR<TradingPositionCreateWithoutTradeHistoryInput, TradingPositionUncheckedCreateWithoutTradeHistoryInput>
  }

  export type AutoBuyQueueCreateWithoutTradeInput = {
    id?: string
    userWalletAddress: string
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
    call?: CallCreateNestedOneWithoutAutoBuyQueueInput
  }

  export type AutoBuyQueueUncheckedCreateWithoutTradeInput = {
    id?: string
    userWalletAddress: string
    callId?: string | null
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type AutoBuyQueueCreateOrConnectWithoutTradeInput = {
    where: AutoBuyQueueWhereUniqueInput
    create: XOR<AutoBuyQueueCreateWithoutTradeInput, AutoBuyQueueUncheckedCreateWithoutTradeInput>
  }

  export type AutoBuyQueueCreateManyTradeInputEnvelope = {
    data: AutoBuyQueueCreateManyTradeInput | AutoBuyQueueCreateManyTradeInput[]
    skipDuplicates?: boolean
  }

  export type TradingPositionUpsertWithoutTradeHistoryInput = {
    update: XOR<TradingPositionUpdateWithoutTradeHistoryInput, TradingPositionUncheckedUpdateWithoutTradeHistoryInput>
    create: XOR<TradingPositionCreateWithoutTradeHistoryInput, TradingPositionUncheckedCreateWithoutTradeHistoryInput>
    where?: TradingPositionWhereInput
  }

  export type TradingPositionUpdateToOneWithWhereWithoutTradeHistoryInput = {
    where?: TradingPositionWhereInput
    data: XOR<TradingPositionUpdateWithoutTradeHistoryInput, TradingPositionUncheckedUpdateWithoutTradeHistoryInput>
  }

  export type TradingPositionUpdateWithoutTradeHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    call?: CallUpdateOneWithoutTradingPositionsNestedInput
    trailingStops?: TrailingStopUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionUncheckedUpdateWithoutTradeHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    trailingStops?: TrailingStopUncheckedUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type AutoBuyQueueUpsertWithWhereUniqueWithoutTradeInput = {
    where: AutoBuyQueueWhereUniqueInput
    update: XOR<AutoBuyQueueUpdateWithoutTradeInput, AutoBuyQueueUncheckedUpdateWithoutTradeInput>
    create: XOR<AutoBuyQueueCreateWithoutTradeInput, AutoBuyQueueUncheckedCreateWithoutTradeInput>
  }

  export type AutoBuyQueueUpdateWithWhereUniqueWithoutTradeInput = {
    where: AutoBuyQueueWhereUniqueInput
    data: XOR<AutoBuyQueueUpdateWithoutTradeInput, AutoBuyQueueUncheckedUpdateWithoutTradeInput>
  }

  export type AutoBuyQueueUpdateManyWithWhereWithoutTradeInput = {
    where: AutoBuyQueueScalarWhereInput
    data: XOR<AutoBuyQueueUpdateManyMutationInput, AutoBuyQueueUncheckedUpdateManyWithoutTradeInput>
  }

  export type TradingPositionCreateWithoutPriceAlertsInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    call?: CallCreateNestedOneWithoutTradingPositionsInput
    trailingStops?: TrailingStopCreateNestedManyWithoutPositionInput
    tradeHistory?: TradeHistoryCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionUncheckedCreateWithoutPriceAlertsInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
    callId?: string | null
    trailingStops?: TrailingStopUncheckedCreateNestedManyWithoutPositionInput
    tradeHistory?: TradeHistoryUncheckedCreateNestedManyWithoutPositionInput
  }

  export type TradingPositionCreateOrConnectWithoutPriceAlertsInput = {
    where: TradingPositionWhereUniqueInput
    create: XOR<TradingPositionCreateWithoutPriceAlertsInput, TradingPositionUncheckedCreateWithoutPriceAlertsInput>
  }

  export type TradingPositionUpsertWithoutPriceAlertsInput = {
    update: XOR<TradingPositionUpdateWithoutPriceAlertsInput, TradingPositionUncheckedUpdateWithoutPriceAlertsInput>
    create: XOR<TradingPositionCreateWithoutPriceAlertsInput, TradingPositionUncheckedCreateWithoutPriceAlertsInput>
    where?: TradingPositionWhereInput
  }

  export type TradingPositionUpdateToOneWithWhereWithoutPriceAlertsInput = {
    where?: TradingPositionWhereInput
    data: XOR<TradingPositionUpdateWithoutPriceAlertsInput, TradingPositionUncheckedUpdateWithoutPriceAlertsInput>
  }

  export type TradingPositionUpdateWithoutPriceAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    call?: CallUpdateOneWithoutTradingPositionsNestedInput
    trailingStops?: TrailingStopUpdateManyWithoutPositionNestedInput
    tradeHistory?: TradeHistoryUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionUncheckedUpdateWithoutPriceAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    trailingStops?: TrailingStopUncheckedUpdateManyWithoutPositionNestedInput
    tradeHistory?: TradeHistoryUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionCreateManyCallInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    entryPrice: Decimal | DecimalJsLike | number | string
    entryAmountSol: Decimal | DecimalJsLike | number | string
    entryAmountTokens: Decimal | DecimalJsLike | number | string
    entryTxSignature?: string | null
    currentPrice?: Decimal | DecimalJsLike | number | string | null
    currentValueSol?: Decimal | DecimalJsLike | number | string | null
    highestPrice?: Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: Decimal | DecimalJsLike | number | string
    stopLossPrice?: Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: Decimal | DecimalJsLike | number | string | null
    exitPrice?: Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: Decimal | DecimalJsLike | number | string | null
    exitReason?: string | null
    exitTxSignature?: string | null
    status?: string
    openedAt?: Date | string
    closedAt?: Date | string | null
    lastUpdated?: Date | string
  }

  export type AutoBuyQueueCreateManyCallInput = {
    id?: string
    userWalletAddress: string
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    tradeId?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type TradingPositionUpdateWithoutCallInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    trailingStops?: TrailingStopUpdateManyWithoutPositionNestedInput
    tradeHistory?: TradeHistoryUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionUncheckedUpdateWithoutCallInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
    trailingStops?: TrailingStopUncheckedUpdateManyWithoutPositionNestedInput
    tradeHistory?: TradeHistoryUncheckedUpdateManyWithoutPositionNestedInput
    priceAlerts?: PriceAlertUncheckedUpdateManyWithoutPositionNestedInput
  }

  export type TradingPositionUncheckedUpdateManyWithoutCallInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    entryPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryAmountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    entryTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    currentPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    currentValueSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    highestPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    realizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    unrealizedPnlPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    stopLossPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    takeProfitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    trailingStopPercentage?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitAmountSol?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    exitReason?: NullableStringFieldUpdateOperationsInput | string | null
    exitTxSignature?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    openedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    closedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastUpdated?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutoBuyQueueUpdateWithoutCallInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    trade?: TradeHistoryUpdateOneWithoutAutoBuyQueueNestedInput
  }

  export type AutoBuyQueueUncheckedUpdateWithoutCallInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AutoBuyQueueUncheckedUpdateManyWithoutCallInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    tradeId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TrailingStopCreateManyPositionInput = {
    id?: string
    highestPrice: Decimal | DecimalJsLike | number | string
    currentStopPrice: Decimal | DecimalJsLike | number | string
    trailingPercentage: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    lastCheckedAt?: Date | string
    triggeredAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TradeHistoryCreateManyPositionInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    tokenSymbol?: string | null
    tradeType: string
    amountSol: Decimal | DecimalJsLike | number | string
    amountTokens: Decimal | DecimalJsLike | number | string
    price: Decimal | DecimalJsLike | number | string
    slippageBps?: number | null
    priceImpactPct?: Decimal | DecimalJsLike | number | string | null
    txSignature?: string | null
    txStatus?: string
    errorMessage?: string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    confirmedAt?: Date | string | null
  }

  export type PriceAlertCreateManyPositionInput = {
    id?: string
    userWalletAddress: string
    tokenAddress: string
    alertType: string
    targetPrice: Decimal | DecimalJsLike | number | string
    isActive?: boolean
    triggeredAt?: Date | string | null
    createdAt?: Date | string
  }

  export type TrailingStopUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrailingStopUncheckedUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TrailingStopUncheckedUpdateManyWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    highestPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    currentStopPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    trailingPercentage?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    lastCheckedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TradeHistoryUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoBuyQueue?: AutoBuyQueueUpdateManyWithoutTradeNestedInput
  }

  export type TradeHistoryUncheckedUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    autoBuyQueue?: AutoBuyQueueUncheckedUpdateManyWithoutTradeNestedInput
  }

  export type TradeHistoryUncheckedUpdateManyWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    tokenSymbol?: NullableStringFieldUpdateOperationsInput | string | null
    tradeType?: StringFieldUpdateOperationsInput | string
    amountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    amountTokens?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    price?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    priceImpactPct?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    txSignature?: NullableStringFieldUpdateOperationsInput | string | null
    txStatus?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    jupiterQuote?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    confirmedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PriceAlertUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceAlertUncheckedUpdateWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PriceAlertUncheckedUpdateManyWithoutPositionInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: StringFieldUpdateOperationsInput | string
    alertType?: StringFieldUpdateOperationsInput | string
    targetPrice?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    triggeredAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AutoBuyQueueCreateManyTradeInput = {
    id?: string
    userWalletAddress: string
    callId?: string | null
    tokenAddress?: string | null
    tokenSymbol: string
    buyAmountSol: Decimal | DecimalJsLike | number | string
    maxPrice?: Decimal | DecimalJsLike | number | string | null
    slippageBps?: number | null
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
    processedAt?: Date | string | null
  }

  export type AutoBuyQueueUpdateWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    call?: CallUpdateOneWithoutAutoBuyQueueNestedInput
  }

  export type AutoBuyQueueUncheckedUpdateWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type AutoBuyQueueUncheckedUpdateManyWithoutTradeInput = {
    id?: StringFieldUpdateOperationsInput | string
    userWalletAddress?: StringFieldUpdateOperationsInput | string
    callId?: NullableStringFieldUpdateOperationsInput | string | null
    tokenAddress?: NullableStringFieldUpdateOperationsInput | string | null
    tokenSymbol?: StringFieldUpdateOperationsInput | string
    buyAmountSol?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    maxPrice?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    slippageBps?: NullableIntFieldUpdateOperationsInput | number | null
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    processedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}