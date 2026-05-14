import 'package:flutter/material.dart';

class FoodDeliveryClone extends StatelessWidget {
  const FoodDeliveryClone({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F0F0F),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildTopSection(),
              _buildCategorySection(),
              _buildFilterSection(),
              _buildExploreMoreSection(),
              _buildRestaurantHeader(),
              _buildRestaurantCard(
                'Paradise Biryani',
                'Biryani, North Indian',
                '4.2',
                '35 mins',
              ),
              _buildRestaurantCard(
                'Bawarchi',
                'Biryani, Chinese',
                '4.1',
                '25 mins',
              ),
              _buildRestaurantCard(
                'Pizza Hut',
                'Pizzas, Fast Food',
                '3.9',
                '40 mins',
              ),
              const SizedBox(height: 100),
            ],
          ),
        ),
      ),
      bottomNavigationBar: _buildBottomNavigationBar(),
    );
  }

  Widget _buildRestaurantCard(
    String name,
    String cuisines,
    String rating,
    String time,
  ) {
    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(
              color: Colors.grey[800],
              borderRadius: BorderRadius.circular(12),
            ),
            child: const Icon(
              Icons.restaurant,
              color: Colors.white12,
              size: 40,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  name,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  cuisines,
                  style: const TextStyle(color: Colors.white54, fontSize: 13),
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 6,
                        vertical: 2,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.green,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Row(
                        children: [
                          Text(
                            rating,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          const SizedBox(width: 2),
                          const Icon(Icons.star, color: Colors.white, size: 10),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Icon(
                      Icons.access_time,
                      color: Colors.white54,
                      size: 14,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      time,
                      style: const TextStyle(
                        color: Colors.white54,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopSection() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            Color(0xFF2196F3), // Light blue
            Color(0xFF0F0F0F), // Fade into background
          ],
          stops: [0.0, 0.8],
        ),
      ),
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.location_on, color: Colors.white, size: 24),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Text(
                          'Mutthi Reddy Kunta',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const Icon(
                          Icons.keyboard_arrow_down,
                          color: Colors.white,
                        ),
                      ],
                    ),
                    const Text(
                      'Miryalaguda',
                      style: TextStyle(color: Colors.white70, fontSize: 14),
                    ),
                  ],
                ),
              ),
              const Icon(
                Icons.account_balance_wallet_outlined,
                color: Colors.white,
                size: 24,
              ),
              const SizedBox(width: 16),
              const CircleAvatar(
                backgroundColor: Color(0xFFFDE8C4),
                radius: 18,
                child: Text(
                  'S',
                  style: TextStyle(
                    color: Color(0xFFC68E17),
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.end,
            children: [
              const Text(
                'VEG MODE',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(width: 8),
              Switch(
                value: false,
                onChanged: (val) {},
                activeThumbColor: Colors.green,
                trackColor: WidgetStateProperty.all(
                  Colors.white.withValues(alpha: 0.3),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
            decoration: BoxDecoration(
              color: const Color(0xFF1E1E1E),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white10),
            ),
            child: Row(
              children: [
                const Icon(Icons.search, color: Colors.white, size: 20),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'Search "chatpata"',
                    style: TextStyle(color: Colors.white54, fontSize: 16),
                  ),
                ),
                const VerticalDivider(
                  color: Colors.white24,
                  thickness: 1,
                  indent: 4,
                  endIndent: 4,
                ),
                const Icon(Icons.mic_none, color: Colors.white, size: 20),
              ],
            ),
          ),
          const SizedBox(height: 20),
          _buildPromoBanner(),
        ],
      ),
    );
  }

  Widget _buildPromoBanner() {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        color: const Color(0xFF1976D2),
        borderRadius: BorderRadius.circular(20),
        image: const DecorationImage(
          image: NetworkImage('https://via.placeholder.com/400x200'),
          fit: BoxFit.cover,
          opacity: 0.3,
        ),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Simplified Comic Background elements (placeholders)
          Positioned(
            left: -20,
            bottom: 20,
            child: Transform.rotate(
              angle: -0.2,
              child: Icon(
                Icons.front_hand,
                color: Colors.blue.withValues(alpha: 0.8),
                size: 100,
              ),
            ),
          ),
          Positioned(
            right: -20,
            bottom: 20,
            child: Transform.rotate(
              angle: 0.2,
              child: Icon(
                Icons.thumb_up,
                color: Colors.red.withValues(alpha: 0.8),
                size: 100,
              ),
            ),
          ),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(4),
                color: Colors.white,
                child: const Text(
                  'BHIM',
                  style: TextStyle(
                    color: Colors.black,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'ZPL',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 48,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2,
                ),
              ),
              const Text(
                'HAND CRICKET',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(
                  horizontal: 24,
                  vertical: 8,
                ),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(4),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.5),
                      blurRadius: 4,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: const Text(
                  'PLAY & WIN',
                  style: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCategorySection() {
    final categories = [
      {'label': 'All', 'isSelected': true},
      {'label': 'Biryani', 'isSelected': false},
      {'label': 'Chicken', 'isSelected': false},
      {'label': 'Burger', 'isSelected': false},
      {'label': 'Fried Rice', 'isSelected': false},
    ];

    return SizedBox(
      height: 120,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 8),
        itemCount: categories.length,
        itemBuilder: (context, index) {
          final category = categories[index];
          return Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Column(
              children: [
                const SizedBox(height: 12),
                Container(
                  width: 65,
                  height: 65,
                  decoration: BoxDecoration(
                    color: Colors.grey[800],
                    shape: BoxShape.circle,
                    border: Border.all(color: Colors.white10),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.restaurant,
                      color: Colors.white24,
                      size: 30,
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Text(
                  category['label'] as String,
                  style: TextStyle(
                    color: category['isSelected'] as bool
                        ? Colors.white
                        : Colors.white70,
                    fontWeight: category['isSelected'] as bool
                        ? FontWeight.bold
                        : FontWeight.normal,
                    fontSize: 12,
                  ),
                ),
                if (category['isSelected'] as bool)
                  Container(
                    margin: const EdgeInsets.only(top: 4),
                    height: 2,
                    width: 20,
                    color: Colors.red,
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildFilterSection() {
    final filters = [
      'Filters',
      'Near & Fast',
      'Under ₹250',
      'Pure Veg',
      'Rating 4.0+',
    ];
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: SizedBox(
        height: 40,
        child: ListView.builder(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16),
          itemCount: filters.length,
          itemBuilder: (context, index) {
            return Container(
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: BoxDecoration(
                color: const Color(0xFF262626),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: Colors.white10),
              ),
              child: Center(
                child: Row(
                  children: [
                    if (index == 0)
                      const Icon(Icons.tune, color: Colors.white70, size: 16),
                    if (index == 0) const SizedBox(width: 4),
                    Text(
                      filters[index],
                      style: const TextStyle(color: Colors.white, fontSize: 13),
                    ),
                    if (index == 0)
                      const Icon(
                        Icons.arrow_drop_down,
                        color: Colors.white70,
                        size: 16,
                      ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }

  Widget _buildExploreMoreSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.fromLTRB(16, 24, 16, 16),
          child: Text(
            'EXPLORE MORE',
            style: TextStyle(
              color: Colors.grey,
              fontSize: 12,
              letterSpacing: 1.2,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        SizedBox(
          height: 120,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: [
              _buildExploreCard('Offers', Icons.percent, Colors.blue),
              _buildExploreCard('Play & win', Icons.games, Colors.indigo),
              _buildExploreCard('Food on train', Icons.train, Colors.blueGrey),
              _buildExploreCard('Collections', Icons.grid_view, Colors.orange),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildExploreCard(String title, IconData icon, Color color) {
    return Container(
      width: 100,
      margin: const EdgeInsets.only(right: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFF1E1E1E),
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.2),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const Spacer(),
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildRestaurantHeader() {
    return const Padding(
      padding: EdgeInsets.fromLTRB(16, 32, 16, 8),
      child: Text(
        '18 RESTAURANTS DELIVERING TO YOU',
        style: TextStyle(
          color: Colors.grey,
          fontSize: 12,
          letterSpacing: 1.2,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildBottomNavigationBar() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
      color: const Color(0xFF121212),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem('Delivery', Icons.delivery_dining, true),
          _buildNavItem('History', Icons.history, false),
          _buildDistrictNavItem(),
        ],
      ),
    );
  }

  Widget _buildNavItem(String label, IconData icon, bool isSelected) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? const Color(0xFF331D1D) : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Icon(
            icon,
            color: isSelected ? Colors.red : Colors.white54,
            size: 24,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            color: isSelected ? Colors.white : Colors.white54,
            fontSize: 12,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ],
    );
  }

  Widget _buildDistrictNavItem() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Colors.deepPurple, Colors.purple],
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        children: [
          const Text(
            'district',
            style: TextStyle(
              color: Colors.white,
              fontWeight: FontWeight.bold,
              fontSize: 16,
            ),
          ),
          const SizedBox(width: 4),
          const Icon(Icons.arrow_outward, color: Colors.white, size: 16),
        ],
      ),
    );
  }
}
