import 'package:flutter/material.dart';

class FoodDeliveryScreen extends StatelessWidget {
  const FoodDeliveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        color: Colors.grey.shade50,
        child: CustomScrollView(
          slivers: [
            SliverAppBar(
              expandedHeight: 180,
              pinned: true,
              backgroundColor: Colors.white,
              foregroundColor: Colors.black,
              flexibleSpace: FlexibleSpaceBar(
                background: Container(
                  color: Colors.orange.shade50,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const SizedBox(height: 40),
                      const Icon(Icons.restaurant_menu, size: 60, color: Colors.orange),
                      const SizedBox(height: 8),
                      Text(
                        'Food Delivery',
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: Colors.orange.shade800,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              title: const Text('Zomato Clone', style: TextStyle(color: Colors.black)),
              actions: [
                IconButton(
                  icon: const Icon(Icons.favorite_border, color: Colors.red),
                  onPressed: () {},
                ),
                IconButton(
                  icon: const Icon(Icons.share, color: Colors.black),
                  onPressed: () {},
                ),
              ],
            ),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Popular near you',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 220,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: 5,
                        itemBuilder: (context, index) {
                          return _FoodCard(
                            name: _foodNames[index],
                            rating: _ratings[index],
                            time: '${20 + index * 5} min',
                            image: Colors.primaries[index % Colors.primaries.length],
                            offer: '${10 + index * 15}% OFF',
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Categories',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 100,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemCount: _categories.length,
                        itemBuilder: (context, index) {
                          return _CategoryChip(
                            name: _categories[index],
                            icon: _categoryIcons[index],
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 24),
                    const Text(
                      'Recommended for you',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 12),
                  ],
                ),
              ),
            ),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return _RestaurantCard(
                    name: _restaurantNames[index],
                    cuisine: _cuisines[index],
                    rating: _ratings2[index],
                    time: _deliveryTimes[index],
                    offer: index.isEven ? '30% OFF' : null,
                    distance: '${1.2 + index * 0.5} km',
                  );
                },
                childCount: _restaurantNames.length,
              ),
            ),
            const SliverToBoxAdapter(child: SizedBox(height: 100)),
          ],
        ),
      ),
    );
  }

  static const List<String> _foodNames = ['Burger', 'Pizza', 'Biryani', 'Sushi', 'Tacos'];
  static const List<double> _ratings = [4.5, 4.8, 4.3, 4.7, 4.2];
  static const List<String> _categories = ['Pizza', 'Burger', 'Biryani', 'Chinese', 'Italian', 'Mexican', 'Desserts', 'Drinks'];
  static const List<IconData> _categoryIcons = [
    Icons.local_pizza, Icons.fastfood, Icons.ramen_dining, Icons.restaurant,
    Icons.dinner_dining, Icons.lunch_dining, Icons.cake, Icons.local_cafe,
  ];
  static const List<String> _restaurantNames = ['Dominos', 'KFC', 'McDonalds', 'Subway', 'Pizza Hut', 'Burger King', 'Starbucks'];
  static const List<String> _cuisines = ['Italian', 'Fast Food', 'Fast Food', 'Healthy', 'Italian', 'Fast Food', 'Cafe'];
  static const List<double> _ratings2 = [4.5, 4.3, 4.2, 4.1, 4.6, 4.4, 4.7];
  static const List<String> _deliveryTimes = ['25 min', '30 min', '20 min', '25 min', '35 min', '20 min', '15 min'];
}

class _FoodCard extends StatelessWidget {
  final String name;
  final double rating;
  final String time;
  final Color image;
  final String offer;

  const _FoodCard({required this.name, required this.rating, required this.time, required this.image, required this.offer});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 160,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            height: 100,
            width: double.infinity,
            decoration: BoxDecoration(color: image, borderRadius: const BorderRadius.vertical(top: Radius.circular(12))),
            child: Stack(
              children: [
                Positioned(
                  top: 8,
                  left: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: Colors.green, borderRadius: BorderRadius.circular(12)),
                    child: Text(offer, style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(10),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14), maxLines: 1, overflow: TextOverflow.ellipsis),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star, size: 14, color: Colors.amber),
                    const SizedBox(width: 4),
                    Text(rating.toString(), style: const TextStyle(fontSize: 12)),
                    const SizedBox(width: 8),
                    const Icon(Icons.access_time, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(time, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String name;
  final IconData icon;

  const _CategoryChip({required this.name, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 80,
      margin: const EdgeInsets.only(right: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4, offset: Offset(0, 2))],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(color: Colors.orange.shade50, shape: BoxShape.circle),
            child: Icon(icon, color: Colors.orange),
          ),
          const SizedBox(height: 8),
          Text(name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
        ],
      ),
    );
  }
}

class _RestaurantCard extends StatelessWidget {
  final String name;
  final String cuisine;
  final double rating;
  final String time;
  final String? offer;
  final String distance;

  const _RestaurantCard({required this.name, required this.cuisine, required this.rating, required this.time, this.offer, required this.distance});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8, offset: Offset(0, 2))],
      ),
      child: Row(
        children: [
          Container(
            width: 80,
            height: 80,
            decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(12)),
            child: const Icon(Icons.restaurant, size: 40, color: Colors.grey),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                const SizedBox(height: 4),
                Text(cuisine, style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.star, size: 14, color: Colors.amber),
                    const SizedBox(width: 4),
                    Text(rating.toString(), style: const TextStyle(fontSize: 12)),
                    const SizedBox(width: 8),
                    const Icon(Icons.access_time, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(time, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                    const SizedBox(width: 8),
                    const Icon(Icons.location_on, size: 14, color: Colors.grey),
                    const SizedBox(width: 4),
                    Text(distance, style: TextStyle(fontSize: 12, color: Colors.grey.shade600)),
                  ],
                ),
                if (offer != null) ...[
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(color: Colors.green.shade50, borderRadius: BorderRadius.circular(4)),
                    child: Text(offer!, style: TextStyle(fontSize: 10, color: Colors.green.shade700, fontWeight: FontWeight.bold)),
                  ),
                ],
              ],
            ),
          ),
        ],
      ),
    );
  }
}