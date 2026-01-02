import time
import hmac
import hashlib
import base64
import requests
import json

# WEEX API Credentials
# Set these values or use environment variables
api_key = "weex_aacd371a38175f8c7e733dcd45ab72b2"
secret_key = "e5041a7bde37a1b0beaec1c65bece56062774d1253b671eadd5681cabf523a6b"
access_passphrase = "weex121211897"

# WEEX API Base URL
# Contract Trading API: https://api-contract.weex.com
# Spot Trading API: https://api-spot.weex.com
# If you're getting HTTP 521 errors, try the other endpoint or check WEEX docs
BASE_URL = "https://api-contract.weex.com"  # For contract/futures trading
# BASE_URL = "https://api-spot.weex.com"    # For spot trading (uncomment to use)

def generate_signature(secret_key, timestamp, method, request_path, query_string, body):
    """
    Generate signature for POST requests
    message = timestamp + method.upper() + request_path + query_string + str(body)
    """
    message = timestamp + method.upper() + request_path + query_string + str(body)
    signature = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).digest()
    return base64.b64encode(signature).decode()

def generate_signature_get(secret_key, timestamp, method, request_path, query_string):
    """
    Generate signature for GET requests
    message = timestamp + method.upper() + request_path + query_string
    """
    message = timestamp + method.upper() + request_path + query_string
    signature = hmac.new(secret_key.encode(), message.encode(), hashlib.sha256).digest()
    return base64.b64encode(signature).decode()

def send_request_post(api_key, secret_key, access_passphrase, method, request_path, query_string, body):
    """
    Send POST request to WEEX API
    """
    timestamp = str(int(time.time() * 1000))
    body_json = json.dumps(body)
    signature = generate_signature(secret_key, timestamp, method, request_path, query_string, body_json)
    
    headers = {
        "ACCESS-KEY": api_key,
        "ACCESS-SIGN": signature,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-PASSPHRASE": access_passphrase,
        "Content-Type": "application/json",
        "locale": "en-US"
    }
    
    url = BASE_URL
    full_url = url + request_path
    
    # Debug output
    print(f"  [DEBUG] URL: {full_url}")
    print(f"  [DEBUG] Method: {method}")
    print(f"  [DEBUG] Headers: ACCESS-KEY={api_key[:10] if api_key else 'NOT SET'}..., ACCESS-TIMESTAMP={timestamp}")
    if body:
        print(f"  [DEBUG] Body: {body_json}")
    
    try:
        if method == "GET":
            response = requests.get(full_url, headers=headers, timeout=10)
        elif method == "POST":
            response = requests.post(full_url, headers=headers, data=body_json, timeout=10)
        return response
    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] Request failed: {e}")
        # Create a mock response object
        class MockResponse:
            status_code = 0
            text = str(e)
        return MockResponse()

def send_request_get(api_key, secret_key, access_passphrase, method, request_path, query_string):
    """
    Send GET request to WEEX API
    """
    timestamp = str(int(time.time() * 1000))
    signature = generate_signature_get(secret_key, timestamp, method, request_path, query_string)
    
    headers = {
        "ACCESS-KEY": api_key,
        "ACCESS-SIGN": signature,
        "ACCESS-TIMESTAMP": timestamp,
        "ACCESS-PASSPHRASE": access_passphrase,
        "Content-Type": "application/json",
        "locale": "en-US"
    }
    
    url = BASE_URL
    full_url = url + request_path + query_string
    
    # Debug output
    print(f"  [DEBUG] URL: {full_url}")
    print(f"  [DEBUG] Method: {method}")
    print(f"  [DEBUG] Headers: ACCESS-KEY={api_key[:10] if api_key else 'NOT SET'}..., ACCESS-TIMESTAMP={timestamp}")
    
    try:
        if method == "GET":
            response = requests.get(full_url, headers=headers, timeout=10)
        return response
    except requests.exceptions.RequestException as e:
        print(f"  [ERROR] Request failed: {e}")
        # Create a mock response object
        class MockResponse:
            status_code = 0
            text = str(e)
        return MockResponse()

def get_account_balance():
    """
    Get account balance
    GET /capi/v2/account/balance
    """
    request_path = "/capi/v2/account/balance"
    query_string = ""
    print(f"\n[GET] Account Balance")
    response = send_request_get(api_key, secret_key, access_passphrase, "GET", request_path, query_string)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 521:
        print("  ⚠️  Error 521: Web Server Is Down (Cloudflare)")
        print("  This usually means:")
        print("    1. The API endpoint might be incorrect")
        print("    2. The server might be temporarily down")
        print("    3. Network/firewall issues")
        print("    4. Check if you need to use a different base URL")
    print(f"Response: {response.text}\n")
    return response

def get_single_position():
    """
    Get single position
    GET /capi/v2/account/position/singlePosition?symbol=cmt_btcusdt
    """
    request_path = "/capi/v2/account/position/singlePosition"
    query_string = "?symbol=cmt_btcusdt"
    response = send_request_get(api_key, secret_key, access_passphrase, "GET", request_path, query_string)
    print(f"\n[GET] Single Position")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def get_ticker():
    """
    Get asset price ticker
    GET /capi/v2/market/ticker?symbol=cmt_btcusdt
    """
    request_path = "/capi/v2/market/ticker"
    query_string = "?symbol=cmt_btcusdt"
    response = send_request_get(api_key, secret_key, access_passphrase, "GET", request_path, query_string)
    print(f"\n[GET] Ticker")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def set_leverage():
    """
    Set leverage
    POST /capi/v2/account/leverage
    """
    request_path = "/capi/v2/account/leverage"
    body = {
        "symbol": "cmt_btcusdt",
        "leverage": "10"
    }
    query_string = ""
    response = send_request_post(api_key, secret_key, access_passphrase, "POST", request_path, query_string, body)
    print(f"\n[POST] Set Leverage")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def place_order():
    """
    Place order
    POST /capi/v2/order/placeOrder
    """
    request_path = "/capi/v2/order/placeOrder"
    body = {
        "symbol": "cmt_btcusdt",
        "client_oid": str(int(time.time() * 1000)),  # Generate unique client order ID
        "size": "0.01",
        "type": "1",  # 1=open long, 2=open short, 3=close long, 4=close short
        "order_type": "0",  # 0=limit, 1=market
        "match_price": "1",  # 0=limit price, 1=market price
        "price": "80000"
    }
    query_string = ""
    response = send_request_post(api_key, secret_key, access_passphrase, "POST", request_path, query_string, body)
    print(f"\n[POST] Place Order")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def get_open_orders():
    """
    Get open orders
    GET /capi/v2/order/openOrders?symbol=cmt_btcusdt
    """
    request_path = "/capi/v2/order/openOrders"
    query_string = "?symbol=cmt_btcusdt"
    response = send_request_get(api_key, secret_key, access_passphrase, "GET", request_path, query_string)
    print(f"\n[GET] Open Orders")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def get_order_history():
    """
    Get order history
    GET /capi/v2/order/orderHistory?symbol=cmt_btcusdt&limit=100
    """
    request_path = "/capi/v2/order/orderHistory"
    query_string = "?symbol=cmt_btcusdt&limit=100"
    response = send_request_get(api_key, secret_key, access_passphrase, "GET", request_path, query_string)
    print(f"\n[GET] Order History")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def get_trade_details():
    """
    Get trade details
    GET /capi/v2/order/trades?symbol=cmt_btcusdt&limit=100
    """
    request_path = "/capi/v2/order/trades"
    query_string = "?symbol=cmt_btcusdt&limit=100"
    response = send_request_get(api_key, secret_key, access_passphrase, "GET", request_path, query_string)
    print(f"\n[GET] Trade Details")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}\n")
    return response

def run_full_test():
    """
    Run complete API test as per WEEX requirements
    """
    print("=" * 60)
    print("WEEX API Test - Running Full Test Suite")
    print("=" * 60)
    
    # Step 1: Check Account Balance
    print("\n[Step 1] Checking Account Balance...")
    get_account_balance()
    time.sleep(1)
    
    # Step 2: Set Leverage
    print("\n[Step 2] Setting Leverage to 10x...")
    set_leverage()
    time.sleep(1)
    
    # Step 3: Get Asset Price
    print("\n[Step 3] Getting Asset Price...")
    get_ticker()
    time.sleep(1)
    
    # Step 4: Place Order
    print("\n[Step 4] Placing Test Order...")
    place_order()
    time.sleep(1)
    
    # Step 5: Get Open Orders
    print("\n[Step 5] Getting Open Orders...")
    get_open_orders()
    time.sleep(1)
    
    # Step 6: Get Order History
    print("\n[Step 6] Getting Order History...")
    get_order_history()
    time.sleep(1)
    
    # Step 7: Get Trade Details
    print("\n[Step 7] Getting Trade Details...")
    get_trade_details()
    
    print("\n" + "=" * 60)
    print("Test Complete!")
    print("=" * 60)

def test_connection():
    """
    Test basic connection to WEEX API
    """
    print("\n[TEST] Testing connection to WEEX API...")
    try:
        # Try a simple GET request without auth first
        print(f"  Testing: {BASE_URL}")
        response = requests.get(BASE_URL, timeout=5)
        print(f"  Status: {response.status_code}")
        if response.status_code == 521:
            print(f"  ⚠️  HTTP 521: Server not responding at {BASE_URL}")
            print(f"  💡 Try switching to:")
            if "contract" in BASE_URL:
                print(f"     https://api-spot.weex.com (for spot trading)")
            else:
                print(f"     https://api-contract.weex.com (for contract trading)")
        return True
    except requests.exceptions.SSLError as e:
        print(f"  ❌ SSL Error: {e}")
        return False
    except requests.exceptions.ConnectionError as e:
        print(f"  ❌ Connection Error: {e}")
        print("  This might mean:")
        print("    - The API endpoint is incorrect")
        print("    - Network/firewall blocking the connection")
        print("    - Server is down")
        return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

if __name__ == '__main__':
    # Check if credentials are set
    if not api_key or not secret_key or not access_passphrase:
        print("⚠️  WARNING: API credentials not set!")
        print("\nPlease set the following variables at the top of this file:")
        print("  - api_key")
        print("  - secret_key")
        print("  - access_passphrase")
        print("\nOr modify the script to read from environment variables.")
        print("\nExample:")
        print('  api_key = "your_api_key_here"')
        print('  secret_key = "your_secret_key_here"')
        print('  access_passphrase = "your_passphrase_here"')
        
        # Still allow testing connection
        print("\n" + "=" * 60)
        test_connection()
        exit(1)
    
    # Test connection first
    print("=" * 60)
    print(f"Using API Base URL: {BASE_URL}")
    print("=" * 60)
    if not test_connection():
        print("\n⚠️  Connection test failed. Check the API endpoint URL.")
        print(f"Current base URL: {BASE_URL}")
        print("\nWEEX has different endpoints:")
        print("  • Contract Trading: https://api-contract.weex.com")
        print("  • Spot Trading: https://api-spot.weex.com")
        print("\nTo switch endpoints, edit BASE_URL in the script.")
        print("\nYou may also want to:")
        print("  1. Verify the correct API endpoint from WEEX documentation")
        print("  2. Check if IP whitelisting is required")
        print("  3. Check your network connection")
        print("  4. Try accessing the API from a browser")
        print("\nContinuing with API tests anyway...\n")
    print("=" * 60)
    
    # Run individual tests or full test suite
    print("\nChoose an option:")
    print("1. Run Full Test Suite (recommended)")
    print("2. Get Account Balance")
    print("3. Get Single Position")
    print("4. Get Ticker")
    print("5. Set Leverage")
    print("6. Place Order")
    print("7. Get Open Orders")
    print("8. Get Order History")
    print("9. Get Trade Details")
    
    choice = input("\nEnter choice (1-9) or press Enter for Full Test: ").strip()
    
    if choice == "" or choice == "1":
        run_full_test()
    elif choice == "2":
        get_account_balance()
    elif choice == "3":
        get_single_position()
    elif choice == "4":
        get_ticker()
    elif choice == "5":
        set_leverage()
    elif choice == "6":
        place_order()
    elif choice == "7":
        get_open_orders()
    elif choice == "8":
        get_order_history()
    elif choice == "9":
        get_trade_details()
    else:
        print("Invalid choice. Running full test...")
        run_full_test()

